import { NextRequest, NextResponse } from 'next/server';

/**
 * Esta función solo verifica si existe el token
 * La validación real debe hacerse en API Routes que se ejecutan en Node.js
 */
export function validateAuthToken(req: NextRequest) {
  const authToken = req.cookies.get('admin-auth-token')?.value;
  
  if (!authToken) {
    return null;
  }
  
  // En el middleware solo verificamos la existencia del token
  // Para usar en Edge Runtime, no hacemos verificación completa
  
  // En lugar de verificar el token, asumimos que será verificado
  // en los endpoints de API que se ejecutan en el entorno de Node.js
  return { 
    exists: true 
  };
}

// Define el tipo de función que acepta req y user opcional
export function withAuth(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    // Verificar si existe el token
    const token = req.cookies.get('admin-auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Acceso no autorizado' },
        { status: 401 }
      );
    }
    
    // En el middleware simplificado, solo verificamos la existencia del token
    // La validación real se hace en los endpoints de API
    
    // Si existe token, continuar con el handler
    return handler(req);
  };
}
