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

export class GoogleDriveService {
    private static instance: GoogleDriveService;
    private isSignedIn = false;
    private currentUser: GoogleDriveUser | null = null;

    private constructor() { }

    public static getInstance(): GoogleDriveService {
        if (!GoogleDriveService.instance) {
            GoogleDriveService.instance = new GoogleDriveService();
        }
        return GoogleDriveService.instance;
    }

    /**
     * Initialize service and check authentication status
     */
    public async initialize(): Promise<void> {
        if (typeof window === 'undefined') {
            return; // Skip initialization on server side
        }

        try {
            await this.checkAuthStatus();
        } catch (error) {
            console.error('Failed to initialize Google Drive service:', error);
        }
    }

    /**
     * Check authentication status from server
     */
    private async checkAuthStatus(): Promise<void> {
        try {
            const response = await fetch('/api/auth/google/status');
            const data = await response.json();

            this.isSignedIn = data.isSignedIn;
            this.currentUser = data.user;
        } catch (error) {
            console.error('Failed to check auth status:', error);
            this.isSignedIn = false;
            this.currentUser = null;
        }
    }

    /**
     * Sign in to Google Drive using server-side OAuth
     */
    public async signIn(): Promise<GoogleDriveUser> {
        if (typeof window === 'undefined') {
            throw new Error('Google Drive sign in is only available in the browser');
        }

        // Redirect to OAuth initiation endpoint
        window.location.href = '/api/auth/google';
        
        // Return a promise that never resolves since we're redirecting
        return new Promise(() => {});
    }

    /**
     * Sign out from Google Drive
     */
    public async signOut(): Promise<void> {
        if (typeof window === 'undefined') {
            return; // Skip sign out on server side
        }

        try {
            const response = await fetch('/api/auth/google/logout', {
                method: 'POST',
            });

            if (response.ok) {
                this.isSignedIn = false;
                this.currentUser = null;
                console.log('Signed out successfully');
            } else {
                throw new Error('Failed to sign out');
            }
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
            const response = await fetch('/api/drive/files');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to list files');
            }

            return data.files || [];
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
            const response = await fetch(`/api/drive/download?fileId=${encodeURIComponent(fileId)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to download file');
            }

            return {
                id: fileId,
                name: '', // Will be filled by caller
                mimeType: '',
                content: data.content,
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

            const response = await fetch('/api/drive/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: htmlContent,
                    filename: fileName,
                    type: 'html',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to upload file');
            }

            return data.fileId;
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

            const response = await fetch('/api/drive/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: jsxContent,
                    filename: fileName,
                    type: 'jsx',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to upload file');
            }

            return data.fileId;
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
