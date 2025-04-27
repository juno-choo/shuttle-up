// src/app/api/auth/sessionLogout/route.ts
import { NextResponse, type NextRequest } from 'next/server';
// Import adminAuth if you plan to implement session revocation later, otherwise optional here
// import { adminAuth } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  console.log('API Route /api/auth/sessionLogout hit'); // Server-side log

  try {
    // Define the options to clear the cookie
    const options = {
      name: '__session', // Must match the cookie name used in sessionLogin
      value: '', // Set the value to empty
      maxAge: 0, // Set maxAge to 0 to expire the cookie immediately
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax' as const,
    };

    // Create a response object to set the cookie clearing options
    const response = NextResponse.json({ status: 'success' }, { status: 200 });

    // Apply the cookie clearing options to the response
    response.cookies.set(options);
    console.log('Session cookie set to expire.'); // Server-side log

    // Optional: If you want to revoke the user's refresh tokens on the server-side
    // (for added security, invalidates all sessions for that user):
    // try {
    //   const sessionCookie = request.cookies.get('__session')?.value;
    //   if (sessionCookie) {
    //     const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
    //     await adminAuth.revokeRefreshTokens(decodedClaims.sub); // sub is the user's uid
    //     console.log('Refresh tokens revoked for user:', decodedClaims.sub);
    //   }
    // } catch (revokeError) {
    //   console.error('Error revoking refresh tokens:', revokeError);
    //   // Don't fail the logout if revocation fails, just log it
    // }

    return response;

  } catch (error: any) {
    console.error('Session Logout Error:', error);
    return NextResponse.json({ error: 'Failed to clear session cookie', details: error.message }, { status: 500 });
  }
}