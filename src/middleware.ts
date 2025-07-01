// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/']; // Added '/' to public paths
const AUTHENTICATED_ENTRY_PATH = '/app'; // Renamed from DEFAULT_AUTHENTICATED_PATH and updated
const LOGIN_PATH = '/login';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('__session');
  const isAuthenticated = !!sessionCookie;

  const isPublic = PUBLIC_PATHS.some(path => pathname === path || (path !== '/' && pathname.startsWith(path + '/')));
  const isAuthenticatingPath = pathname.startsWith(LOGIN_PATH);
  const isAppPath = pathname.startsWith(AUTHENTICATED_ENTRY_PATH);

  if (isAuthenticated) {
    // If authenticated and trying to access login page, redirect to authenticated entry
    if (isAuthenticatingPath) {
      return NextResponse.redirect(new URL(AUTHENTICATED_ENTRY_PATH, request.url));
    }
    // If authenticated and trying to access the root public page, redirect to authenticated entry
    // This prevents showing the generic landing page to logged-in users if they navigate to "/"
    if (pathname === '/') {
      return NextResponse.redirect(new URL(AUTHENTICATED_ENTRY_PATH, request.url));
    }
  } else {
    // If not authenticated and trying to access an app path, redirect to login
    if (isAppPath) {
      return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    }
    // Allow access to public paths (includes '/' and '/login')
    if (!isPublic && !isAuthenticatingPath) {
        // This case should ideally not be hit if PUBLIC_PATHS and isAppPath cover all scenarios
        // but as a fallback, redirect to login for any other non-public, non-authenticating path.
        return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except for API routes, static files, images, etc.
    '/((?!api|_next/static|_next/image|favico.ico|fonts|images).*)',
  ],
};