import { NextRequest, NextResponse } from 'next/server';
import { validateAuthToken } from './authMiddleware';
import { hasPermission } from './roleUtils';

export async function checkRolePermission(
  req: NextRequest,
  module: string,
  action: string = 'view'
) {
  // Verificar autenticación - en esta función solo verificamos la existencia del token
  // La validación real se hace en los endpoints API
  const tokenExists = validateAuthToken(req);
  
  if (!tokenExists) {
    return false;
  }
  
  // En el middleware, no podemos hacer una validación completa
  // En su lugar, devolvemos true si existe el token
  // La validación real de permisos debe hacerse en los endpoints API que se ejecutan en Node.js
  return true;
}

export async function protectAdminRoute(
  req: NextRequest,
  res: NextResponse,
  module: string,
  action: string = 'view'
) {
  const hasToken = await checkRolePermission(req, module, action);
  
  if (!hasToken) {
    // Redirigir a la página de inicio de sesión si no hay token
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
  
  // Si existe token, permitimos el acceso
  // La validación detallada de permisos se hará en los endpoints API
  return res;
}
