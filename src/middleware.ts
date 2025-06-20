import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateAuthToken } from './lib/authMiddleware';
import { hasPermission } from './lib/roleUtils';

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

  // Verificar permisos específicos por ruta
  if (authCookie && pathname.startsWith('/admin')) {
    // Obtener datos del usuario
    const userData = await validateAuthToken(request);

    if (userData) {
      const role = userData.role as string;

      // Verificar permisos según la ruta
      if (pathname.startsWith('/admin/news') && !hasPermission(role, 'news', 'view')) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }

      if (pathname.startsWith('/admin/testimonios') && !hasPermission(role, 'testimonials', 'view')) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }

      if (pathname.startsWith('/admin/mensajes') && !hasPermission(role, 'messages', 'view')) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }

      if (pathname.startsWith('/admin/usuarios') && !hasPermission(role, 'users', 'view')) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }

      if (pathname.startsWith('/admin/documentos') && !hasPermission(role, 'documents', 'view')) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
