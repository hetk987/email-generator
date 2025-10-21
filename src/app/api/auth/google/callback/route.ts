import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { db } from '@/lib/db';

/**
 * OAuth callback handler
 * Exchanges authorization code for tokens and creates user session
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            console.error('OAuth error:', error);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=auth_failed`);
        }

        if (!code) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=no_code`);
        }

        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri = process.env.GOOGLE_REDIRECT_URI;

        if (!clientId || !clientSecret || !redirectUri) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=config_missing`);
        }

        const oauth2Client = new google.auth.OAuth2(
            clientId,
            clientSecret,
            redirectUri
        );

        // Exchange authorization code for tokens
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Get user info
        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const userInfo = await oauth2.userinfo.get();

        if (!userInfo.data.id || !userInfo.data.email) {
            throw new Error('Failed to get user information');
        }

        // Create user session
        const session = {
            userId: userInfo.data.id,
            email: userInfo.data.email,
            name: userInfo.data.name || userInfo.data.email,
            picture: userInfo.data.picture,
            refreshToken: tokens.refresh_token!,
            accessToken: tokens.access_token,
            tokenExpiry: tokens.expiry_date,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        // Save session to database
        await db.saveSession(session);

        // Create HTTP-only cookie for session management
        const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?auth=success`);

        response.cookies.set('user_session', userInfo.data.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60, // 30 days
        });

        return response;
    } catch (error) {
        console.error('OAuth callback error:', error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=callback_failed`);
    }
}
