import { google } from 'googleapis';
import { db, UserSession } from './db';

export interface DriveFile {
    id: string;
    name: string;
    mimeType: string;
    modifiedTime: string;
    size?: string;
    content?: string;
}

export interface UploadResult {
    fileId: string;
    fileName: string;
    webViewLink: string;
}

/**
 * Server-side Google Drive API wrapper
 * Handles authentication, file operations, and app folder management
 */
export class DriveApiService {
    private static instance: DriveApiService;
    private appFolderName = 'Email Generator Templates';
    private appFolderId: string | null = null;

    private constructor() { }

    public static getInstance(): DriveApiService {
        if (!DriveApiService.instance) {
            DriveApiService.instance = new DriveApiService();
        }
        return DriveApiService.instance;
    }

    /**
     * Get authenticated Drive API client for user
     */
    private async getDriveClient(userId: string): Promise<any> {
        const session = await db.getSession(userId);
        if (!session) {
            throw new Error('User session not found');
        }

        const oauth2Client = new google.auth.OAuth2(
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        // Set credentials
        oauth2Client.setCredentials({
            refresh_token: session.refreshToken,
            access_token: session.accessToken,
        });

        // Check if access token is expired and refresh if needed
        if (session.tokenExpiry && Date.now() >= session.tokenExpiry) {
            try {
                const { credentials } = await oauth2Client.refreshAccessToken();

                // Update session with new access token
                await db.updateAccessToken(
                    userId,
                    credentials.access_token!,
                    credentials.expiry_date!
                );

                oauth2Client.setCredentials(credentials);
            } catch (error) {
                console.error('Failed to refresh access token:', error);
                throw new Error('Failed to refresh access token');
            }
        }

        return google.drive({ version: 'v3', auth: oauth2Client });
    }

    /**
     * Get or create app-specific folder
     */
    private async getAppFolder(userId: string): Promise<string> {
        if (this.appFolderId) {
            return this.appFolderId;
        }

        const drive = await this.getDriveClient(userId);

        try {
            // Search for existing app folder
            const response = await drive.files.list({
                q: `name='${this.appFolderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
                fields: 'files(id, name)',
            });

            if (response.data.files && response.data.files.length > 0) {
                this.appFolderId = response.data.files[0].id!;
                return this.appFolderId!;
            }

            // Create new app folder
            const folderResponse = await drive.files.create({
                requestBody: {
                    name: this.appFolderName,
                    mimeType: 'application/vnd.google-apps.folder',
                },
                fields: 'id',
            });

            this.appFolderId = folderResponse.data.id!;
            return this.appFolderId!;
        } catch (error) {
            console.error('Failed to get/create app folder:', error);
            throw new Error('Failed to access app folder');
        }
    }

    /**
     * List files in app folder
     */
    public async listFiles(userId: string): Promise<DriveFile[]> {
        const drive = await this.getDriveClient(userId);
        const folderId = await this.getAppFolder(userId);

        try {
            const response = await drive.files.list({
                q: `'${folderId}' in parents and trashed=false`,
                fields: 'files(id, name, mimeType, modifiedTime, size)',
                orderBy: 'modifiedTime desc',
            });

            return (response.data.files || []).map((file: any) => ({
                id: file.id!,
                name: file.name!,
                mimeType: file.mimeType!,
                modifiedTime: file.modifiedTime!,
                size: file.size,
            }));
        } catch (error) {
            console.error('Failed to list files:', error);
            throw new Error('Failed to list files');
        }
    }

    /**
     * Download file content
     */
    public async downloadFile(userId: string, fileId: string): Promise<string> {
        const drive = await this.getDriveClient(userId);

        try {
            const response = await drive.files.get({
                fileId: fileId,
                alt: 'media',
            }, {
                responseType: 'text',
            });

            return response.data as string;
        } catch (error) {
            console.error('Failed to download file:', error);
            throw new Error('Failed to download file');
        }
    }

    /**
     * Upload file to app folder
     */
    public async uploadFile(
        userId: string,
        content: string,
        fileName: string,
        mimeType: string
    ): Promise<UploadResult> {
        const drive = await this.getDriveClient(userId);
        const folderId = await this.getAppFolder(userId);

        try {
            // Check if file already exists and update it
            const existingFiles = await drive.files.list({
                q: `name='${fileName}' and '${folderId}' in parents and trashed=false`,
                fields: 'files(id)',
            });

            let fileId: string;
            let webViewLink: string;

            if (existingFiles.data.files && existingFiles.data.files.length > 0) {
                // Update existing file
                fileId = existingFiles.data.files[0].id!;

                const updateResponse = await drive.files.update({
                    fileId: fileId,
                    requestBody: {
                        name: fileName,
                    },
                    media: {
                        mimeType: mimeType,
                        body: content,
                    },
                    fields: 'webViewLink',
                });

                webViewLink = updateResponse.data.webViewLink!;
            } else {
                // Create new file
                const createResponse = await drive.files.create({
                    requestBody: {
                        name: fileName,
                        parents: [folderId],
                    },
                    media: {
                        mimeType: mimeType,
                        body: content,
                    },
                    fields: 'id, webViewLink',
                });

                fileId = createResponse.data.id!;
                webViewLink = createResponse.data.webViewLink!;
            }

            return {
                fileId,
                fileName,
                webViewLink,
            };
        } catch (error) {
            console.error('Failed to upload file:', error);
            throw new Error('Failed to upload file');
        }
    }
}

export const driveApiService = DriveApiService.getInstance();
