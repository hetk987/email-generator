import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * Logout endpoint
 * Clears user session and cookies
 */
export async function POST(request: NextRequest) {
    try {
        const userId = request.cookies.get('user_session')?.value;

        if (userId) {
            // Delete session from database
            await db.deleteSession(userId);
        }

        // Clear cookie and redirect
        const response = NextResponse.json(
            { success: true, message: 'Logged out successfully' },
            { status: 200 }
        );

        response.cookies.delete('user_session');

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Failed to logout' },
            { status: 500 }
        );
    }
}
