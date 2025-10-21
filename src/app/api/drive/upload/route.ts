import { NextRequest, NextResponse } from 'next/server';
import { driveApiService } from '@/lib/driveApi';

/**
 * Upload file endpoint
 * Uploads content to Google Drive app folder
 */
export async function POST(request: NextRequest) {
    try {
        const userId = request.cookies.get('user_session')?.value;

        if (!userId) {
            return NextResponse.json(
                { error: 'User not authenticated' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { content, filename, type } = body;

        if (!content || !filename || !type) {
            return NextResponse.json(
                { error: 'Missing required fields: content, filename, type' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!['jsx', 'html'].includes(type.toLowerCase())) {
            return NextResponse.json(
                { error: 'Invalid file type. Only JSX and HTML files are supported.' },
                { status: 400 }
            );
        }

        // Determine MIME type based on file type
        const mimeType = type.toLowerCase() === 'html'
            ? 'text/html'
            : 'text/javascript';

        const result = await driveApiService.uploadFile(
            userId,
            content,
            filename,
            mimeType
        );

        return NextResponse.json({
            fileId: result.fileId,
            fileName: result.fileName,
            webViewLink: result.webViewLink,
            success: true,
        });
    } catch (error) {
        console.error('Upload file error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}
