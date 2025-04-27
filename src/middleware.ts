// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public paths that don't require authentication
const PUBLIC_PATHS = ['/login']; // Add other public paths like /about, /register if needed

// Define the default path after login
const DEFAULT_AUTHENTICATED_PATH = '/';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`Middleware running for path: ${pathname}`); // Server-side log

  // Check for the secure, HttpOnly session cookie set by your API route
  const sessionCookie = request.cookies.get('__session');
  const isAuthenticated = !!sessionCookie; // User is authenticated if the cookie exists

  console.log(`Middleware check: isAuthenticated = ${isAuthenticated}`); // Server-side log

  const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));

  // --- Redirect logged-in users away from public pages ---
  if (isAuthenticated && isPublicPath) {
    console.log('Middleware: Authenticated user accessing public path. Redirecting to /'); // Server-side log
    return NextResponse.redirect(new URL(DEFAULT_AUTHENTICATED_PATH, request.url));
  }

  // --- Redirect logged-out users trying to access protected pages ---
  // This block was commented out for testing, now it's active again using the sessionCookie
  if (!isAuthenticated && !isPublicPath) {
    console.log('Middleware: Unauthenticated user accessing protected path. Redirecting to /login'); // Server-side log
    // Redirect them to the login page
    const loginUrl = new URL('/login', request.url);
    // Optional: Add query param to redirect back after login
    // loginUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // --- Allow request to proceed ---
  // (Authenticated user accessing protected path OR
  //  Unauthenticated user accessing public path)
  console.log('Middleware: Allowing request to proceed.'); // Server-side log
  return NextResponse.next();
}

// Configure the middleware to run on specific paths (usually keep this as is)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - fonts (font files)
     * - images (image files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|fonts|images).*)',
  ],
};