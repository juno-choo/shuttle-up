// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOGIN_PATH = '/login';
const APP_PATH = '/app';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('__session');
  const isAuthenticated = !!sessionCookie;

  // Logic for authenticated users
  if (isAuthenticated) {
    // If an authenticated user tries to access the login page,
    // redirect them to the app's entry point.
    if (pathname.startsWith(LOGIN_PATH)) {
      return NextResponse.redirect(new URL(APP_PATH, request.url));
    }
  }

  // --- THIS IS THE KEY CHANGE ---
  // WE NO LONGER BLOCK UNAUTHENTICATED USERS FROM /app.
  // The client-side AuthenticatedLayout component now handles that responsibility.
  // This prevents the server-side redirect from racing with the client-side navigation.

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  // We only need the middleware to run for paths where a redirect might happen.
  matcher: [
    '/app/:path*',
    '/login',
  ],
};