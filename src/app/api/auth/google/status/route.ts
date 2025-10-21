import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * Authentication status endpoint
 * Returns current user info and session state
 */
export async function GET(request: NextRequest) {
    try {
        const userId = request.cookies.get('user_session')?.value;

        if (!userId) {
            return NextResponse.json(
                { isSignedIn: false, user: null },
                { status: 200 }
            );
        }

        const session = await db.getSession(userId);

        if (!session) {
            // Clear invalid cookie
            const response = NextResponse.json(
                { isSignedIn: false, user: null },
                { status: 200 }
            );
            response.cookies.delete('user_session');
            return response;
        }

        // Return user info without sensitive data
        const userInfo = {
            id: session.userId,
            email: session.email,
            name: session.name,
            picture: session.picture,
        };

        return NextResponse.json({
            isSignedIn: true,
            user: userInfo,
        });
    } catch (error) {
        console.error('Auth status error:', error);
        return NextResponse.json(
            { error: 'Failed to check authentication status' },
            { status: 500 }
        );
    }
}
