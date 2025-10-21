import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

/**
 * OAuth initiation endpoint
 * Redirects user to Google consent screen with Drive API scopes
 */
export async function GET(request: NextRequest) {
    try {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri = process.env.GOOGLE_REDIRECT_URI;

        if (!clientId || !clientSecret || !redirectUri) {
            return NextResponse.json(
                { error: 'Missing Google OAuth configuration' },
                { status: 500 }
            );
        }

        const oauth2Client = new google.auth.OAuth2(
            clientId,
            clientSecret,
            redirectUri
        );

        // Define scopes for Drive API access
        const scopes = [
            'https://www.googleapis.com/auth/drive.file', // Create and manage files
            'https://www.googleapis.com/auth/drive.readonly', // Read files
            'https://www.googleapis.com/auth/userinfo.email', // User email
            'https://www.googleapis.com/auth/userinfo.profile', // User profile
        ];

        // Generate authorization URL
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline', // Request refresh token
            scope: scopes,
            prompt: 'consent', // Force consent screen to get refresh token
            state: 'email-generator-auth', // Optional state parameter
        });

        // Redirect to Google consent screen
        return NextResponse.redirect(authUrl);
    } catch (error) {
        console.error('OAuth initiation error:', error);
        return NextResponse.json(
            { error: 'Failed to initiate OAuth flow' },
            { status: 500 }
        );
    }
}
