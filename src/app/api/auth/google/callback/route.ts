import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { db } from '@/lib/db';

/**
 * OAuth callback handler
 * Exchanges authorization code for tokens and creates user session
 */
export async function GET(request: NextRequest) {
    console.log('OAuth callback received:', request.url);

    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        console.log('OAuth callback params:', { code: !!code, error });

        if (error) {
            console.error('OAuth error:', error);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=auth_failed`);
        }

        if (!code) {
            console.error('No authorization code received');
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=no_code`);
        }

        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri = process.env.GOOGLE_REDIRECT_URI;

        console.log('Environment check:', {
            hasClientId: !!clientId,
            hasClientSecret: !!clientSecret,
            hasRedirectUri: !!redirectUri,
            redirectUri
        });

        if (!clientId || !clientSecret || !redirectUri) {
            console.error('Missing OAuth configuration');
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=config_missing`);
        }

        const oauth2Client = new google.auth.OAuth2(
            clientId,
            clientSecret,
            redirectUri
        );

        // Exchange authorization code for tokens
        console.log('Exchanging authorization code for tokens...');
        const { tokens } = await oauth2Client.getToken(code);
        console.log('Tokens received:', {
            hasAccessToken: !!tokens.access_token,
            hasRefreshToken: !!tokens.refresh_token,
            expiryDate: tokens.expiry_date
        });

        oauth2Client.setCredentials(tokens);

        // Get user info
        console.log('Getting user info...');
        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const userInfo = await oauth2.userinfo.get();
        console.log('User info received:', {
            id: userInfo.data.id,
            email: userInfo.data.email,
            name: userInfo.data.name
        });

        if (!userInfo.data.id || !userInfo.data.email) {
            throw new Error('Failed to get user information');
        }

        // Create user session
        const session = {
            userId: userInfo.data.id,
            email: userInfo.data.email,
            name: userInfo.data.name || userInfo.data.email,
            picture: userInfo.data.picture || undefined,
            refreshToken: tokens.refresh_token!,
            accessToken: tokens.access_token || undefined,
            tokenExpiry: tokens.expiry_date || undefined,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        // Save session to database
        console.log('Saving session to database...');
        await db.saveSession(session);
        console.log('Session saved successfully');

        // Create HTTP-only cookie for session management
        const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?auth=success`);
        console.log('Redirecting to:', `${process.env.NEXT_PUBLIC_APP_URL}?auth=success`);

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
