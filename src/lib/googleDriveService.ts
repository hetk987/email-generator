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

// Load Google Identity Services and Drive API scripts
const loadGoogleScripts = async (): Promise<void> => {
    if (typeof window === 'undefined') return;

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

            // Check if Google Identity Services is available
            if (!window.google) {
                throw new Error('Google Identity Services is not available after script loading');
            }

            // Initialize Google Identity Services
            console.log('Initializing Google Identity Services with client ID:', clientId);
            console.log('Current origin:', window.location.origin);

            window.google.accounts.id.initialize({
                client_id: clientId,
                auto_select: false,
                callback: this.handleCredentialResponse.bind(this)
            });

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
     * Handle credential response from Google Identity Services
     */
    private handleCredentialResponse(response: any): void {
        try {
            const credential = response.credential;
            const payload = JSON.parse(atob(credential.split('.')[1]));

            this.isSignedIn = true;
            this.currentUser = {
                id: payload.sub,
                email: payload.email,
                name: payload.name,
                picture: payload.picture
            };

            // Save credential to localStorage for future sessions
            localStorage.setItem('google_credential', credential);

            // Exchange credential for access token
            this.exchangeCredentialForToken(credential);

            // Resolve the sign-in promise if it exists
            if ((this as any).signInResolve) {
                (this as any).signInResolve(this.currentUser);
                (this as any).signInResolve = null;
                (this as any).signInReject = null;
            }
        } catch (error) {
            console.error('Error handling credential response:', error);
            if ((this as any).signInReject) {
                (this as any).signInReject(error);
                (this as any).signInResolve = null;
                (this as any).signInReject = null;
            }
        }
    }

    /**
     * Exchange credential for access token
     */
    private async exchangeCredentialForToken(credential: string): Promise<void> {
        try {
            const response = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                    assertion: credential,
                }),
            });

            if (!response.ok) {
                throw new Error(`Token exchange failed: ${response.statusText}`);
            }

            const tokenData = await response.json();
            this.accessToken = tokenData.access_token;

            // Set the access token for gapi client
            if (window.gapi && window.gapi.client) {
                window.gapi.client.setApiKey(this.accessToken);
            }
        } catch (error) {
            console.error('Error exchanging credential for token:', error);
        }
    }

    /**
     * Check if user is already signed in from previous session
     */
    private checkExistingSignIn(): void {
        try {
            // Check localStorage for existing credential
            const savedCredential = localStorage.getItem('google_credential');
            if (savedCredential) {
                const payload = JSON.parse(atob(savedCredential.split('.')[1]));

                // Check if token is still valid (not expired)
                const currentTime = Math.floor(Date.now() / 1000);
                if (payload.exp && payload.exp > currentTime) {
                    this.handleCredentialResponse({ credential: savedCredential });
                } else {
                    // Token expired, remove it
                    localStorage.removeItem('google_credential');
                }
            }
        } catch (error) {
            console.error('Error checking existing sign in:', error);
            localStorage.removeItem('google_credential');
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
            try {
                // Store resolve/reject for callback
                (this as any).signInResolve = resolve;
                (this as any).signInReject = reject;

                // Trigger Google Sign-In popup
                window.google.accounts.id.prompt((notification: any) => {
                    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                        reject(new Error('Sign-in was cancelled or not displayed'));
                    }
                });

                // Set up a timeout for the sign-in process
                setTimeout(() => {
                    if (!this.isSignedIn) {
                        reject(new Error('Sign-in timeout'));
                    }
                }, 30000); // 30 second timeout

            } catch (error) {
                console.error('Sign in failed:', error);
                reject(error);
            }
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
            // Sign out from Google Identity Services
            if (window.google && window.google.accounts) {
                window.google.accounts.id.disableAutoSelect();
            }

            // Clear local state
            this.isSignedIn = false;
            this.currentUser = null;
            this.accessToken = null;

            // Remove stored credential
            localStorage.removeItem('google_credential');

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
