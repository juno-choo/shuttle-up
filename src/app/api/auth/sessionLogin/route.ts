// src/app/api/auth/sessionLogin/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin'; // Adjust path if necessary

export async function POST(request: NextRequest) {
  console.log('API Route /api/auth/sessionLogin hit'); // Server-side log

  // --- ADD THIS CHECK ---
  if (!adminAuth) {
    console.error('Session Login Error: Firebase Admin SDK not initialized.');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }
  // --- END CHECK ---

  try {
    const body = await request.json();
    const idToken = body.idToken?.toString();

    if (!idToken) {
      console.log('ID token missing from request body');
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
    }

    const expiresIn = 60 * 60 * 24 * 14 * 1000; // 14 days in milliseconds

    console.log('Creating session cookie...');
    // Now it's safe to use adminAuth because we checked it above
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    console.log('Session cookie created successfully.');

    const options = {
      name: '__session',
      value: sessionCookie,
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax' as const,
    };

    const response = NextResponse.json({ status: 'success' }, { status: 200 });
    response.cookies.set(options);
    console.log('Session cookie set in response.');

    return response;

  } catch (error: any) {
    console.error('Session Login Error:', error.code, error.message);
    if (error.code === 'auth/id-token-expired' || error.code === 'auth/argument-error') {
         return NextResponse.json({ error: 'Invalid ID token', details: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to create session cookie', details: 'An internal server error occurred.' }, { status: 500 });
  }
}