import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

/**
 * Valida el token JWT y devuelve los datos del usuario
 * Esta función debe usarse solo en rutas de API o server components
 * que se ejecutan en el entorno de Node.js
 */
export async function validateToken() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('admin-auth-token')?.value;
  
  if (!authToken) {
    return null;
  }
  
  try {
    const JWT_SECRET = process.env.JWT_SECRET ?? 'your-secret-key-change-in-production';
    const decoded = jwt.verify(authToken, JWT_SECRET) as { id: string };
    
    // Obtener datos completos del usuario desde la base de datos
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });
    
    if (!user) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error validando token en el servidor:', error);
    return null;
  }
}

/**
 * Verifica si un usuario tiene permisos para una acción específica
 */
export async function checkUserPermission(moduleType: string, actionType: string) {
  const user = await validateToken();
  
  if (!user) {
    return false;
  }
    // Importar hasPermission de manera dinámica para evitar problemas de circular imports
  const { hasPermission } = await import('./roleUtils');
  return hasPermission(user.role, moduleType as any, actionType as any);
}
