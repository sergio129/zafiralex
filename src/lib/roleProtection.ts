import { NextRequest, NextResponse } from 'next/server';
import { validateAuthToken } from './authMiddleware';
import { hasPermission } from './roleUtils';

export async function checkRolePermission(
  req: NextRequest,
  module: string,
  action: string = 'view'
) {
  // Verificar autenticación
  const user = await validateAuthToken(req);
  
  if (!user) {
    return false;
  }
  
  // Verificar permisos para el módulo y la acción específica
  return hasPermission(user.role as string, module as any, action as any);
}

export async function protectAdminRoute(
  req: NextRequest,
  res: NextResponse,
  module: string,
  action: string = 'view'
) {
  const hasPermission = await checkRolePermission(req, module, action);
  
  if (!hasPermission) {
    // Redirigir a la página de inicio de sesión o dashboard según corresponda
    const user = await validateAuthToken(req);
    
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    } else {
      // Si el usuario está autenticado pero no tiene permisos para esta ruta
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
  }
  
  return res;
}
