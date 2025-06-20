import { NextRequest, NextResponse } from 'next/server';

export async function validateAuthToken(req: NextRequest) {
  const authToken = req.cookies.get('admin-auth-token')?.value;
  
  if (!authToken) {
    return null;
  }
    try {
    const { verify } = await import('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET ?? 'your-secret-key-change-in-production';
    
    const decoded = verify(authToken, JWT_SECRET);
    return decoded as Record<string, unknown>;
  } catch (error) {
    console.error('Error validando token:', error);
    return null;
  }
}

// Define el tipo de función que acepta req y user opcional
export function withAuth(
  handler: (req: NextRequest, user?: Record<string, unknown>) => Promise<NextResponse>,
  allowedRoles?: string[]
) {
  return async (req: NextRequest) => {
    // Verificar autenticación
    const user = await validateAuthToken(req);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Acceso no autorizado' },
        { status: 401 }
      );
    }
    
    // Si hay roles permitidos especificados, verificar que el usuario tenga uno de esos roles
    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = user.role as string;
      
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.json(
          { message: 'No tienes permiso para acceder a este recurso' },
          { status: 403 }
        );
      }
    }
    
    // Si está autenticado y tiene los permisos necesarios, continuar con el handler
    return handler(req, user);
  };
}
