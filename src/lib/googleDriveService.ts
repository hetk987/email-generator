// Type declarations for Google APIs
declare global {
    interface Window {
        google: any;
        gapi: any;
    }
}

export interface GoogleDriveFile {
    id: string;
    name: string;
    mimeType: string;
    content?: string;
    modifiedTime?: string;
    size?: string;
}

export interface GoogleDriveUser {
    id: string;
    email: string;
    name: string;
    picture?: string;
}

/**
 * Client-side Google Drive service using Google Identity Services (GIS)
 * Uses modern OAuth 2.0 flow for authentication
 */
export class GoogleDriveService {
    private static instance: GoogleDriveService;
    private isInitialized = false;
    private isSignedIn = false;
    private currentUser: GoogleDriveUser | null = null;
    private accessToken: string | null = null;
    private appFolderId: string | null = process.env.NEXT_PUBLIC_DRIVE_FOLDER_ID || null;
    private appFolderName: string | null = process.env.NEXT_PUBLIC_DRIVE_FOLDER_NAME || null;
    private isSharedDrive: boolean = false;

    private constructor() { }

    public static getInstance(): GoogleDriveService {
        if (!GoogleDriveService.instance) {
            GoogleDriveService.instance = new GoogleDriveService();
        }
        return GoogleDriveService.instance;
    }

    /**
     * Initialize Google APIs and check for existing authentication
     */
    public async initialize(): Promise<void> {
        if (typeof window === 'undefined') {
            return; // Skip initialization on server side
        }

        if (this.isInitialized) {
            return;
        }

        try {
            await this.loadGoogleScripts();
            await this.checkExistingAuth();
            this.isInitialized = true;
        } catch (error) {
            console.error('Failed to initialize Google Drive service:', error);
            throw error;
        }
    }

    /**
     * Load Google Identity Services script
     */
    private async loadGoogleScripts(): Promise<void> {
        return new Promise((resolve, reject) => {
            // Check if script is already loaded
            if (window.google?.accounts?.oauth2) {
                resolve();
                return;
            }

            const onScriptLoad = () => {
                resolve();
            };

            const onScriptError = (error: any) => {
                console.error('Script load error:', error);
                reject(new Error(`Failed to load Google Identity Services script: ${error}`));
            };

            // Load only Google Identity Services script
            const identityScript = document.createElement('script');
            identityScript.src = 'https://accounts.google.com/gsi/client';
            identityScript.async = true;
            identityScript.defer = true;
            identityScript.onload = onScriptLoad;
            identityScript.onerror = onScriptError;
            document.head.appendChild(identityScript);
        });
    }

    /**
     * Check for existing authentication
     */
    private async checkExistingAuth(): Promise<void> {
        try {
            const token = localStorage.getItem('google_access_token');
            if (token) {
                this.accessToken = token;
                await this.loadUserInfo();
                this.isSignedIn = true;
            }
        } catch (error) {
            console.error('Error checking existing auth:', error);
            localStorage.removeItem('google_access_token');
        }
    }

    /**
     * Load user information using Google Identity Services
     */
    private async loadUserInfo(): Promise<void> {
        try {
            if (!this.accessToken) {
                throw new Error('No access token available');
            }

            // Use Google Identity Services to get user info
            const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user info');
            }

            const userInfo = await response.json();
            this.currentUser = {
                id: userInfo.id,
                email: userInfo.email,
                name: userInfo.name,
                picture: userInfo.picture
            };
        } catch (error) {
            console.error('Failed to load user info:', error);
            throw error;
        }
    }

    /**
     * Sign in to Google Drive using Google Identity Services
     */
    public async signIn(): Promise<GoogleDriveUser> {
        if (typeof window === 'undefined') {
            throw new Error('Google Drive sign in is only available in the browser');
        }

        if (!this.isInitialized) {
            await this.initialize();
        }

        return new Promise((resolve, reject) => {
            // Use Google Identity Services for authentication
            window.google.accounts.oauth2.initTokenClient({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
                callback: async (response: any) => {
                    try {
                        if (response.error) {
                            throw new Error(response.error);
                        }

                        this.accessToken = response.access_token;
                        if (this.accessToken) {
                            localStorage.setItem('google_access_token', this.accessToken);
                        }

                        await this.loadUserInfo();
                        this.isSignedIn = true;

                        resolve(this.currentUser!);
                    } catch (error) {
                        console.error('Sign in error:', error);
                        reject(error);
                    }
                }
            }).requestAccessToken();
        });
    }

    /**
     * Sign out from Google Drive
     */
    public async signOut(): Promise<void> {
        if (typeof window === 'undefined') {
            return; // Skip sign out on server side
        }

        try {
            // Use Google Identity Services to revoke token
            if (this.accessToken && window.google?.accounts?.oauth2) {
                window.google.accounts.oauth2.revoke(this.accessToken);
            }

            this.isSignedIn = false;
            this.currentUser = null;
            this.accessToken = null;
            this.appFolderId = null;

            localStorage.removeItem('google_access_token');
            console.log('Signed out successfully');
        } catch (error) {
            console.error('Sign out failed:', error);
            throw error;
        }
    }

    /**
     * Get current user info
     */
    public getCurrentUser(): GoogleDriveUser | null {
        return this.currentUser;
    }

    /**
     * Check if user is signed in
     */
    public getIsSignedIn(): boolean {
        return this.isSignedIn;
    }

    /**
     * Set the shared drive folder ID directly
     */
    public setSharedDriveFolder(folderId: string): void {
        this.appFolderId = folderId;
        this.isSharedDrive = true;
    }

    /**
     * Get or create app-specific folder
     */
    private async getAppFolder(): Promise<string> {
        if (this.appFolderId) {
            return this.appFolderId;
        }

        try {
            if (!this.accessToken) {
                throw new Error('No access token available');
            }

            // Check if we're working with a shared drive folder ID
            if (this.appFolderId && this.appFolderId.startsWith('1Rr9zqZ9UpF27egCpa8Cv_cEg5dXiNTIm')) {
                this.isSharedDrive = true;
                return this.appFolderId;
            }

            // Search for existing app folder (include shared drives)
            const searchParams = new URLSearchParams({
                q: `name='${this.appFolderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
                fields: 'files(id,name)',
                supportsAllDrives: 'true',
                includeItemsFromAllDrives: 'true'
            });

            const response = await fetch(`https://www.googleapis.com/drive/v3/files?${searchParams}`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to search for app folder');
            }

            const data = await response.json();

            if (data.files && data.files.length > 0) {
                this.appFolderId = data.files[0].id;
                return this.appFolderId!;
            }

            // For shared drives, we cannot create folders programmatically without proper permissions
            // Instead, we'll use the provided folder ID directly
            if (this.appFolderId) {
                return this.appFolderId;
            }

            // Create new app folder (only for personal drives)
            const createResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: this.appFolderName,
                    mimeType: 'application/vnd.google-apps.folder'
                })
            });

            if (!createResponse.ok) {
                throw new Error('Failed to create app folder');
            }

            const folderData = await createResponse.json();
            this.appFolderId = folderData.id;
            return this.appFolderId!;
        } catch (error) {
            console.error('Failed to get/create app folder:', error);
            throw new Error('Failed to access app folder');
        }
    }

    /**
     * List files from Google Drive app folder
     */
    public async listFiles(): Promise<GoogleDriveFile[]> {
        if (typeof window === 'undefined') {
            throw new Error('Google Drive is only available in the browser');
        }

        if (!this.isSignedIn) {
            throw new Error('User must be signed in to access Google Drive');
        }

        try {
            const folderId = await this.getAppFolder();
            const searchParams = new URLSearchParams({
                q: `'${folderId}' in parents and trashed=false`,
                fields: 'files(id,name,mimeType,modifiedTime,size)',
                orderBy: 'modifiedTime desc',
                supportsAllDrives: 'true',
                includeItemsFromAllDrives: 'true'
            });

            const response = await fetch(`https://www.googleapis.com/drive/v3/files?${searchParams}`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to list files');
            }

            const data = await response.json();
            return (data.files || []).map((file: any) => ({
                id: file.id,
                name: file.name,
                mimeType: file.mimeType,
                modifiedTime: file.modifiedTime,
                size: file.size,
            }));
        } catch (error) {
            console.error('Failed to list files:', error);
            throw error;
        }
    }

    /**
     * Download file content from Google Drive
     */
    public async downloadFile(fileId: string): Promise<GoogleDriveFile> {
        if (typeof window === 'undefined') {
            throw new Error('Google Drive is only available in the browser');
        }

        if (!this.isSignedIn) {
            throw new Error('User must be signed in to access Google Drive');
        }

        try {
            const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to download file');
            }

            const content = await response.text();
            return {
                id: fileId,
                name: '', // Will be filled by caller
                mimeType: '',
                content: content,
            };
        } catch (error) {
            console.error('Failed to download file:', error);
            throw error;
        }
    }

    /**
     * Upload HTML content to Google Drive
     */
    public async uploadHtmlToDrive(htmlContent: string, filename?: string): Promise<string> {
        if (typeof window === 'undefined') {
            throw new Error('Google Drive is only available in the browser');
        }

        if (!this.isSignedIn) {
            throw new Error('User must be signed in to upload to Google Drive');
        }

        try {
            const fileName = filename || `email-template-${Date.now()}.html`;
            const folderId = await this.getAppFolder();

            // Check if file already exists (include shared drives)
            const searchParams = new URLSearchParams({
                q: `name='${fileName}' and '${folderId}' in parents and trashed=false`,
                fields: 'files(id)',
                supportsAllDrives: 'true',
                includeItemsFromAllDrives: 'true'
            });

            const existingResponse = await fetch(`https://www.googleapis.com/drive/v3/files?${searchParams}`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });

            if (!existingResponse.ok) {
                throw new Error('Failed to check for existing file');
            }

            const existingData = await existingResponse.json();

            if (existingData.files && existingData.files.length > 0) {
                // Update existing file
                const fileId = existingData.files[0].id;
                const updateUrl = this.isSharedDrive
                    ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media&supportsAllDrives=true`
                    : `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;

                const updateResponse = await fetch(updateUrl, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'text/html'
                    },
                    body: htmlContent
                });

                if (!updateResponse.ok) {
                    throw new Error('Failed to update file');
                }

                return fileId;
            } else {
                // Create new file
                const createUrl = this.isSharedDrive
                    ? 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true'
                    : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

                const createResponse = await fetch(createUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'multipart/related; boundary=boundary'
                    },
                    body: this.createMultipartBody(fileName, folderId, htmlContent, 'text/html')
                });

                if (!createResponse.ok) {
                    throw new Error('Failed to create file');
                }

                const createData = await createResponse.json();
                return createData.id;
            }
        } catch (error) {
            console.error('Failed to upload HTML:', error);
            throw error;
        }
    }

    /**
     * Create multipart body for file upload
     */
    private createMultipartBody(fileName: string, folderId: string, content: string, mimeType: string): string {
        const metadata = JSON.stringify({
            name: fileName,
            parents: [folderId]
        });

        return [
            '--boundary',
            'Content-Type: application/json; charset=UTF-8',
            '',
            metadata,
            '--boundary',
            `Content-Type: ${mimeType}`,
            '',
            content,
            '--boundary--'
        ].join('\r\n');
    }

    /**
     * Upload JSX content to Google Drive
     */
    public async uploadJsxToDrive(jsxContent: string, filename?: string): Promise<string> {
        if (typeof window === 'undefined') {
            throw new Error('Google Drive is only available in the browser');
        }

        if (!this.isSignedIn) {
            throw new Error('User must be signed in to upload to Google Drive');
        }

        try {
            const fileName = filename || `email-template-${Date.now()}.jsx`;
            const folderId = await this.getAppFolder();

            // Check if file already exists (include shared drives)
            const searchParams = new URLSearchParams({
                q: `name='${fileName}' and '${folderId}' in parents and trashed=false`,
                fields: 'files(id)',
                supportsAllDrives: 'true',
                includeItemsFromAllDrives: 'true'
            });

            const existingResponse = await fetch(`https://www.googleapis.com/drive/v3/files?${searchParams}`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });

            if (!existingResponse.ok) {
                throw new Error('Failed to check for existing file');
            }

            const existingData = await existingResponse.json();

            if (existingData.files && existingData.files.length > 0) {
                // Update existing file
                const fileId = existingData.files[0].id;
                const updateUrl = this.isSharedDrive
                    ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media&supportsAllDrives=true`
                    : `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;

                const updateResponse = await fetch(updateUrl, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'text/javascript'
                    },
                    body: jsxContent
                });

                if (!updateResponse.ok) {
                    throw new Error('Failed to update file');
                }

                return fileId;
            } else {
                // Create new file
                const createUrl = this.isSharedDrive
                    ? 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true'
                    : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

                const createResponse = await fetch(createUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'multipart/related; boundary=boundary'
                    },
                    body: this.createMultipartBody(fileName, folderId, jsxContent, 'text/javascript')
                });

                if (!createResponse.ok) {
                    throw new Error('Failed to create file');
                }

                const createData = await createResponse.json();
                return createData.id;
            }
        } catch (error) {
            console.error('Failed to upload JSX:', error);
            throw error;
        }
    }

    /**
     * Pick file from Drive (now implemented as list + select)
     * This method is kept for backward compatibility
     */
    public async pickFileFromDrive(): Promise<GoogleDriveFile> {
        // This method is now handled by the UI dropdown
        // Keep for backward compatibility but throw informative error
        throw new Error('File picker is now handled by the file dropdown in the UI. Use listFiles() to get available files.');
    }
}

export const googleDriveService = GoogleDriveService.getInstance();