import { NextRequest, NextResponse } from 'next/server';
import { driveApiService } from '@/lib/driveApi';

/**
 * List files endpoint
 * Returns array of files from the app-specific folder
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

        const files = await driveApiService.listFiles(userId);

        // Filter for relevant file types (JSX, HTML, TXT)
        const relevantFiles = files.filter(file => {
            const fileName = file.name.toLowerCase();
            return fileName.endsWith('.jsx') ||
                fileName.endsWith('.tsx') ||
                fileName.endsWith('.html') ||
                fileName.endsWith('.txt');
        });

        return NextResponse.json({
            files: relevantFiles,
            success: true,
        });
    } catch (error) {
        console.error('List files error:', error);
        return NextResponse.json(
            { error: 'Failed to list files' },
            { status: 500 }
        );
    }
}
