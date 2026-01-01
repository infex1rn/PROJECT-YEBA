import { NextRequest, NextResponse } from 'next/server';
import { shouldRedirectToMobile, getMobileRoute } from './lib/device-detection';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';

  // Check if should redirect to mobile
  if (shouldRedirectToMobile(pathname, userAgent)) {
    const mobileRoute = getMobileRoute(pathname);
    const url = request.nextUrl.clone();
    url.pathname = mobileRoute;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
