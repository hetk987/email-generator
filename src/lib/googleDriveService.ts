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
 * Client-side Google Drive service using Google Identity Services and Drive API
 * Uses OAuth 2.0 implicit flow for authentication
 */
export class GoogleDriveService {
    private static instance: GoogleDriveService;
    private isInitialized = false;
    private isSignedIn = false;
    private currentUser: GoogleDriveUser | null = null;
    private accessToken: string | null = null;
    private appFolderId: string | null = null;
    private appFolderName = 'Email Generator Templates';

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
            await this.initializeGapi();
            await this.checkExistingAuth();
            this.isInitialized = true;
        } catch (error) {
            console.error('Failed to initialize Google Drive service:', error);
            throw error;
        }
    }

    /**
     * Load Google API scripts
     */
    private async loadGoogleScripts(): Promise<void> {
        return new Promise((resolve, reject) => {
            // Check if scripts are already loaded
            if (window.google && window.gapi) {
                resolve();
                return;
            }

            let loadedCount = 0;
            const totalScripts = 2;

            const onScriptLoad = () => {
                loadedCount++;
                if (loadedCount === totalScripts) {
                    resolve();
                }
            };

            const onScriptError = (error: any) => {
                console.error('Script load error:', error);
                reject(new Error(`Failed to load Google API script: ${error}`));
            };

            // Load Google Identity Services script
            const identityScript = document.createElement('script');
            identityScript.src = 'https://accounts.google.com/gsi/client';
            identityScript.async = true;
            identityScript.defer = true;
            identityScript.onload = onScriptLoad;
            identityScript.onerror = onScriptError;
            document.head.appendChild(identityScript);

            // Load Google API script for Drive operations
            const apiScript = document.createElement('script');
            apiScript.src = 'https://apis.google.com/js/api.js';
            apiScript.async = true;
            apiScript.defer = true;
            apiScript.onload = onScriptLoad;
            apiScript.onerror = onScriptError;
            document.head.appendChild(apiScript);
        });
    }

    /**
     * Initialize Google API client
     */
    private async initializeGapi(): Promise<void> {
        return new Promise((resolve, reject) => {
            window.gapi.load('client', async () => {
                try {
                    await window.gapi.client.init({
                        apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
                        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
                        scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly'
                    });
                    resolve();
                } catch (error) {
                    console.error('GAPI client init error:', error);
                    reject(error);
                }
            });
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
     * Load user information
     */
    private async loadUserInfo(): Promise<void> {
        try {
            const response = await window.gapi.client.oauth2.userinfo.get();
            this.currentUser = {
                id: response.result.id,
                email: response.result.email,
                name: response.result.name,
                picture: response.result.picture
            };
        } catch (error) {
            console.error('Failed to load user info:', error);
            throw error;
        }
    }

    /**
     * Sign in to Google Drive
     */
    public async signIn(): Promise<GoogleDriveUser> {
        if (typeof window === 'undefined') {
            throw new Error('Google Drive sign in is only available in the browser');
        }

        if (!this.isInitialized) {
            await this.initialize();
        }

        return new Promise((resolve, reject) => {
            window.gapi.auth2.getAuthInstance().signIn().then(
                async (googleUser: any) => {
                    try {
                        this.accessToken = googleUser.getAuthResponse().access_token;
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
                },
                (error: any) => {
                    console.error('Sign in failed:', error);
                    reject(error);
                }
            );
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
            if (window.gapi.auth2) {
                const authInstance = window.gapi.auth2.getAuthInstance();
                if (authInstance) {
                    await authInstance.signOut();
                }
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
     * Get or create app-specific folder
     */
    private async getAppFolder(): Promise<string> {
        if (this.appFolderId) {
            return this.appFolderId;
        }

        try {
            // Search for existing app folder
            const response = await window.gapi.client.drive.files.list({
                q: `name='${this.appFolderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
                fields: 'files(id, name)',
            });

            if (response.result.files && response.result.files.length > 0) {
                this.appFolderId = response.result.files[0].id;
                return this.appFolderId!;
            }

            // Create new app folder
            const folderResponse = await window.gapi.client.drive.files.create({
                resource: {
                    name: this.appFolderName,
                    mimeType: 'application/vnd.google-apps.folder',
                },
                fields: 'id',
            });

            this.appFolderId = folderResponse.result.id;
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
            const response = await window.gapi.client.drive.files.list({
                q: `'${folderId}' in parents and trashed=false`,
                fields: 'files(id, name, mimeType, modifiedTime, size)',
                orderBy: 'modifiedTime desc',
            });

            return (response.result.files || []).map((file: any) => ({
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
            const response = await window.gapi.client.drive.files.get({
                fileId: fileId,
                alt: 'media',
            });

            return {
                id: fileId,
                name: '', // Will be filled by caller
                mimeType: '',
                content: response.body,
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

            // Check if file already exists
            const existingFiles = await window.gapi.client.drive.files.list({
                q: `name='${fileName}' and '${folderId}' in parents and trashed=false`,
                fields: 'files(id)',
            });

            let fileId: string;

            if (existingFiles.result.files && existingFiles.result.files.length > 0) {
                // Update existing file
                fileId = existingFiles.result.files[0].id;
                await window.gapi.client.drive.files.update({
                    fileId: fileId,
                    resource: {
                        name: fileName,
                    },
                    media: {
                        mimeType: 'text/html',
                        body: htmlContent,
                    },
                });
            } else {
                // Create new file
                const createResponse = await window.gapi.client.drive.files.create({
                    resource: {
                        name: fileName,
                        parents: [folderId],
                    },
                    media: {
                        mimeType: 'text/html',
                        body: htmlContent,
                    },
                    fields: 'id',
                });

                fileId = createResponse.result.id;
            }

            return fileId;
        } catch (error) {
            console.error('Failed to upload HTML:', error);
            throw error;
        }
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

            // Check if file already exists
            const existingFiles = await window.gapi.client.drive.files.list({
                q: `name='${fileName}' and '${folderId}' in parents and trashed=false`,
                fields: 'files(id)',
            });

            let fileId: string;

            if (existingFiles.result.files && existingFiles.result.files.length > 0) {
                // Update existing file
                fileId = existingFiles.result.files[0].id;
                await window.gapi.client.drive.files.update({
                    fileId: fileId,
                    resource: {
                        name: fileName,
                    },
                    media: {
                        mimeType: 'text/javascript',
                        body: jsxContent,
                    },
                });
            } else {
                // Create new file
                const createResponse = await window.gapi.client.drive.files.create({
                    resource: {
                        name: fileName,
                        parents: [folderId],
                    },
                    media: {
                        mimeType: 'text/javascript',
                        body: jsxContent,
                    },
                    fields: 'id',
                });

                fileId = createResponse.result.id;
            }

            return fileId;
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