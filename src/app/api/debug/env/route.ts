import { NextRequest, NextResponse } from 'next/server';

/**
 * Debug endpoint to check environment variables
 */
export async function GET(request: NextRequest) {
    return NextResponse.json({
        hasClientId: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasRedirectUri: !!process.env.GOOGLE_REDIRECT_URI,
        hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
        redirectUri: process.env.GOOGLE_REDIRECT_URI,
        appUrl: process.env.NEXT_PUBLIC_APP_URL,
    });
}
