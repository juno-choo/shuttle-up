// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login'];
const DEFAULT_AUTHENTICATED_PATH = '/';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('__session');
  const isAuthenticated = !!sessionCookie;

  if (isAuthenticated && isPublicPath(pathname)) {
    return NextResponse.redirect(new URL(DEFAULT_AUTHENTICATED_PATH, request.url));
  }

  if (!isAuthenticated && !isPublicPath(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Helper function to check public paths
function isPublicPath(pathname: string): boolean {
    return PUBLIC_PATHS.some(path => pathname.startsWith(path));
}


export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|fonts|images).*)',
  ],
};