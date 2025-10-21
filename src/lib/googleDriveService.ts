// Type declarations for Google Identity Services
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
}

export interface GoogleDriveUser {
    id: string;
    email: string;
    name: string;
    picture?: string;
}

// Load Google API scripts for traditional OAuth flow
const loadGoogleScripts = async (): Promise<void> => {
    if (typeof window === 'undefined') return;

    return new Promise((resolve, reject) => {
        // Check if scripts are already loaded
        if (window.gapi) {
            resolve();
            return;
        }

        const onScriptLoad = () => {
            resolve();
        };

        const onScriptError = (error: any) => {
            console.error('Script load error:', error);
            reject(new Error(`Failed to load Google API script: ${error}`));
        };

        // Load Google API script for OAuth and Drive operations
        const apiScript = document.createElement('script');
        apiScript.src = 'https://apis.google.com/js/api.js';
        apiScript.async = true;
        apiScript.defer = true;
        apiScript.onload = onScriptLoad;
        apiScript.onerror = onScriptError;
        document.head.appendChild(apiScript);
    });
};

export class GoogleDriveService {
    private static instance: GoogleDriveService;
    private isInitialized = false;
    private isSignedIn = false;
    private currentUser: GoogleDriveUser | null = null;
    private accessToken: string | null = null;

    private constructor() { }

    public static getInstance(): GoogleDriveService {
        if (!GoogleDriveService.instance) {
            GoogleDriveService.instance = new GoogleDriveService();
        }
        return GoogleDriveService.instance;
    }

    /**
     * Initialize Google Identity Services and Drive API
     */
    public async initialize(): Promise<void> {
        if (typeof window === 'undefined') {
            return; // Skip initialization on server side
        }

        if (this.isInitialized) return;

        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId) {
            throw new Error('Google Client ID not found. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your environment variables.');
        }

        try {
            // Load Google API scripts first
            await loadGoogleScripts();

            // Wait for scripts to be fully ready
            await new Promise(resolve => setTimeout(resolve, 500));

            // Check if gapi is available
            if (!window.gapi) {
                throw new Error('Google API (gapi) is not available after script loading');
            }

            // Initialize Google API for Drive operations
            await new Promise<void>((resolve, reject) => {
                window.gapi.load('client', async () => {
                    try {
                        await window.gapi.client.init({
                            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
                        });

                        this.isInitialized = true;
                        console.log('Google API initialized successfully');
                        resolve();
                    } catch (error) {
                        console.error('GAPI client init error:', error);
                        reject(error);
                    }
                });
            });

            // Check if user is already signed in (from previous session)
            this.checkExistingSignIn();

        } catch (error) {
            console.error('Failed to initialize Google API:', error);
            throw error;
        }
    }


    /**
     * Check if user is already signed in from previous session
     */
    private checkExistingSignIn(): void {
        try {
            // Check if user is already signed in with traditional OAuth
            if (window.gapi && window.gapi.auth2) {
                const authInstance = window.gapi.auth2.getAuthInstance();
                if (authInstance && authInstance.isSignedIn.get()) {
                    this.isSignedIn = true;
                    const user = authInstance.currentUser.get();
                    this.currentUser = {
                        id: user.getId(),
                        email: user.getBasicProfile().getEmail(),
                        name: user.getBasicProfile().getName(),
                        picture: user.getBasicProfile().getImageUrl()
                    };
                    this.accessToken = user.getAuthResponse().access_token;
                }
            }
        } catch (error) {
            console.error('Error checking existing sign in:', error);
        }
    }

    /**
     * Sign in to Google Drive using traditional OAuth flow (more reliable for Drive API)
     */
    public async signIn(): Promise<GoogleDriveUser> {
        if (typeof window === 'undefined') {
            throw new Error('Google Drive sign in is only available in the browser');
        }

        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            // Use the traditional OAuth flow for Drive API access
            await new Promise<void>((resolve, reject) => {
                window.gapi.load('auth2', async () => {
                    try {
                        const authInstance = await window.gapi.auth2.init({
                            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                            scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly'
                        });

                        const user = await authInstance.signIn();

                        this.isSignedIn = true;
                        this.currentUser = {
                            id: user.getId(),
                            email: user.getBasicProfile().getEmail(),
                            name: user.getBasicProfile().getName(),
                            picture: user.getBasicProfile().getImageUrl()
                        };

                        this.accessToken = user.getAuthResponse().access_token;

                        resolve();
                    } catch (error) {
                        console.error('OAuth sign-in failed:', error);
                        reject(error);
                    }
                });
            });

            return this.currentUser!;
        } catch (error) {
            console.error('Sign in failed:', error);
            throw error;
        }
    }

    /**
     * Sign out from Google Drive
     */
    public async signOut(): Promise<void> {
        if (typeof window === 'undefined') {
            return; // Skip sign out on server side
        }

        try {
            // Sign out from traditional OAuth
            if (window.gapi && window.gapi.auth2) {
                const authInstance = window.gapi.auth2.getAuthInstance();
                if (authInstance) {
                    await authInstance.signOut();
                }
            }

            // Clear local state
            this.isSignedIn = false;
            this.currentUser = null;
            this.accessToken = null;

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
     * Open Google Drive file picker and return selected file content
     */
    public async pickFileFromDrive(): Promise<GoogleDriveFile> {
        if (typeof window === 'undefined') {
            throw new Error('Google Drive picker is only available in the browser');
        }

        if (!this.isInitialized) {
            await this.initialize();
        }

        if (!this.isSignedIn || !this.accessToken) {
            throw new Error('User must be signed in to access Google Drive');
        }

        return new Promise((resolve, reject) => {
            // Load the picker API
            window.gapi.load('picker', () => {
                const picker = new window.google.picker.PickerBuilder()
                    .addView(window.google.picker.ViewId.DOCS)
                    .setOAuthToken(this.accessToken!)
                    .setDeveloperKey(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!)
                    .setCallback((data: any) => {
                        if (data.action === window.google.picker.Action.PICKED) {
                            const fileId = data.docs[0].id;
                            this.downloadFileContent(fileId)
                                .then(content => {
                                    resolve({
                                        id: fileId,
                                        name: data.docs[0].name,
                                        mimeType: data.docs[0].mimeType,
                                        content: content
                                    });
                                })
                                .catch(reject);
                        } else if (data.action === window.google.picker.Action.CANCEL) {
                            reject(new Error('File picker was cancelled'));
                        }
                    })
                    .build();

                picker.setVisible(true);
            });
        });
    }

    /**
     * Download file content from Google Drive
     */
    private async downloadFileContent(fileId: string): Promise<string> {
        try {
            const response = await (window as any).gapi.client.drive.files.get({
                fileId: fileId,
                alt: 'media'
            });

            return response.body;
        } catch (error) {
            console.error('Failed to download file content:', error);
            throw error;
        }
    }

    /**
     * Upload HTML content to Google Drive
     */
    public async uploadHtmlToDrive(htmlContent: string, filename?: string): Promise<string> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        if (!this.isSignedIn || !this.accessToken) {
            throw new Error('User must be signed in to upload to Google Drive');
        }

        const folderId = process.env.NEXT_PUBLIC_DRIVE_FOLDER_ID;
        if (!folderId) {
            throw new Error('Drive folder ID not found. Please set NEXT_PUBLIC_DRIVE_FOLDER_ID in your environment variables.');
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const finalFilename = filename || `email-template-${timestamp}.html`;

        try {
            const metadata = {
                name: finalFilename,
                parents: [folderId],
                mimeType: 'text/html'
            };

            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            form.append('file', new Blob([htmlContent], { type: 'text/html' }));

            const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                },
                body: form
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const result = await response.json();
            return result.id;
        } catch (error) {
            console.error('Failed to upload to Google Drive:', error);
            throw error;
        }
    }

    /**
     * Upload JSX content to Google Drive
     */
    public async uploadJsxToDrive(jsxContent: string, filename?: string): Promise<string> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        if (!this.isSignedIn || !this.accessToken) {
            throw new Error('User must be signed in to upload to Google Drive');
        }

        const folderId = process.env.NEXT_PUBLIC_DRIVE_FOLDER_ID;
        if (!folderId) {
            throw new Error('Drive folder ID not found. Please set NEXT_PUBLIC_DRIVE_FOLDER_ID in your environment variables.');
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const finalFilename = filename || `email-template-${timestamp}.jsx`;

        try {
            const metadata = {
                name: finalFilename,
                parents: [folderId],
                mimeType: 'text/javascript'
            };

            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            form.append('file', new Blob([jsxContent], { type: 'text/javascript' }));

            const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                },
                body: form
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const result = await response.json();
            return result.id;
        } catch (error) {
            console.error('Failed to upload JSX to Google Drive:', error);
            throw error;
        }
    }
}

export const googleDriveService = GoogleDriveService.getInstance();
