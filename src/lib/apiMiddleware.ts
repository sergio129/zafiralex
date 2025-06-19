import { NextRequest, NextResponse } from 'next/server';
import { sanitizeObject } from '@/lib/sanitizeUtils';

/**
 * Middleware para sanitizar automáticamente todas las entradas de solicitudes API
 * 
 * @param request - Solicitud entrante
 */
export async function sanitizeApiRequest(
  request: NextRequest,
  fields?: {
    htmlFields?: string[];
    skipFields?: string[];
  }
) {
  // Solo procesar solicitudes POST, PUT o PATCH
  const method = request.method.toUpperCase();
  if (!['POST', 'PUT', 'PATCH'].includes(method)) {
    return request;
  }

  try {
    // Clonar la solicitud para poder modificarla
    const contentType = request.headers.get('content-type') || '';
    
    // Manejar solicitudes JSON
    if (contentType.includes('application/json')) {
      const body = await request.json();
      const sanitizedBody = sanitizeObject(body, {
        htmlFields: fields?.htmlFields || ['content', 'description'],
        skipFields: fields?.skipFields || ['password', 'hashedPassword']
      });

      // Crear una nueva solicitud con el cuerpo sanitizado
      const newRequest = new NextRequest(request.url, {
        method: request.method,
        headers: request.headers,
        body: JSON.stringify(sanitizedBody),
        redirect: request.redirect,
        // Mantener el resto de las propiedades de la solicitud original
      });

      return newRequest;
    }
    
    // Para solicitudes multipart/form-data, no podemos sanitizar fácilmente
    // ya que no se puede recrear el FormData sin acceso al Blob original
    // Se recomienda sanitizar manualmente en el controlador para estos casos

    // Devolver la solicitud original si no se pudo sanitizar
    return request;
  } catch (error) {
    console.error('Error sanitizando la solicitud:', error);
    return request;
  }
}

/**
 * Ejemplo de uso: Middleware para proteger endpoints específicos 
 * con sanitización de entradas
 * 
 * Para usar, importar en el archivo middleware.ts:
 * import { sanitizedApiHandler } from './lib/apiMiddleware';
 * 
 * Y envolver tus rutas:
 * export default function middleware(request: NextRequest) {
 *   // Aplicar solo a rutas API de admin
 *   if (request.nextUrl.pathname.startsWith('/api/admin')) {
 *     return sanitizedApiHandler(request);
 *   }
 * }
 * 
 * export const config = {
 *   matcher: '/api/:path*',
 * };
 */
export async function sanitizedApiHandler(request: NextRequest) {
  // Sanitizar la solicitud
  const sanitizedRequest = await sanitizeApiRequest(request);
  
  // Continuar con la cadena de middleware
  return NextResponse.next({
    request: sanitizedRequest,
  });
}
