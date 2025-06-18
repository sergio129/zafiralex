import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the token from cookies
  const authCookie = request.cookies.get('admin-auth-token')?.value;
  
  // Path the user is requesting
  const { pathname } = request.nextUrl;
  
  // If trying to access login page and already has token, redirect to dashboard
  if (pathname.startsWith('/admin/login') && authCookie) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }
  
  // If trying to access admin section without token, redirect to login
  if (pathname.startsWith('/admin') && 
      !pathname.startsWith('/admin/login') && 
      !pathname.startsWith('/admin/api') &&
      !authCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
