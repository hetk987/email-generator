import { NextRequest, NextResponse } from 'next/server';
import { driveApiService } from '@/lib/driveApi';

/**
 * Download file endpoint
 * Downloads file content by fileId
 */
export async function GET(request: NextRequest) {
    try {
        const userId = request.cookies.get('user_session')?.value;

        if (!userId) {
            return NextResponse.json(
                { error: 'User not authenticated' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const fileId = searchParams.get('fileId');

        if (!fileId) {
            return NextResponse.json(
                { error: 'File ID is required' },
                { status: 400 }
            );
        }

        const content = await driveApiService.downloadFile(userId, fileId);

        return NextResponse.json({
            content,
            success: true,
        });
    } catch (error) {
        console.error('Download file error:', error);
        return NextResponse.json(
            { error: 'Failed to download file' },
            { status: 500 }
        );
    }
}
