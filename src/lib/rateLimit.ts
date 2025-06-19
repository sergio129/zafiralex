import { NextRequest, NextResponse } from 'next/server';

interface RateLimitOptions {
  limit: number; // Número máximo de solicitudes permitidas
  windowMs: number; // Ventana de tiempo en milisegundos
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// Almacén de rate limiting en memoria (para producción debería usar Redis)
const rateLimitStore: RateLimitStore = {};

// Función para limpiar el almacén periódicamente
function cleanupRateLimitStore() {
  const now = Date.now();
  for (const key in rateLimitStore) {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  }
}

// Limpiar cada 5 minutos
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}

/**
 * Obtiene una clave única para el rate limiting basada en IP y ruta
 * @param req - La solicitud
 * @returns Clave única
 */
function getRateLimitKey(req: NextRequest): string {  // Obtener IP del cliente
  const ip = req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             '127.0.0.1';
  
  // Obtener ruta
  const path = req.nextUrl.pathname;
  
  // Crear clave combinada
  return `${ip}:${path}`;
}

/**
 * Middleware para limitar el número de solicitudes
 * @param req - Solicitud entrante
 * @param options - Opciones de rate limiting
 * @returns NextResponse si se excede el límite, undefined de lo contrario
 */
export function rateLimit(
  req: NextRequest, 
  options: RateLimitOptions = { limit: 100, windowMs: 60 * 1000 }
): NextResponse | undefined {
  // Obtener clave única
  const key = getRateLimitKey(req);
  
  // Tiempo actual
  const now = Date.now();
  
  // Inicializar o actualizar el contador
  if (!rateLimitStore[key] || rateLimitStore[key].resetTime < now) {
    rateLimitStore[key] = {
      count: 1,
      resetTime: now + options.windowMs
    };
  } else {
    rateLimitStore[key].count += 1;
  }
  
  // Verificar límite
  if (rateLimitStore[key].count > options.limit) {
    // Calcular tiempo de espera
    const resetTimeSeconds = Math.ceil((rateLimitStore[key].resetTime - now) / 1000);
    
    // Devolver respuesta 429 (Too Many Requests)
    return NextResponse.json(
      { message: 'Demasiadas solicitudes, inténtelo más tarde.' },
      { 
        status: 429,
        headers: {
          'Retry-After': resetTimeSeconds.toString(),
          'X-RateLimit-Limit': options.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil(rateLimitStore[key].resetTime / 1000).toString()
        }
      }
    );
  }
  
  // Si está dentro del límite, devolver encabezados informativos
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', options.limit.toString());
  response.headers.set('X-RateLimit-Remaining', (options.limit - rateLimitStore[key].count).toString());
  response.headers.set('X-RateLimit-Reset', Math.ceil(rateLimitStore[key].resetTime / 1000).toString());
  
  return undefined;
}

/**
 * Configuraciones predefinidas de rate limiting para diferentes propósitos
 */
export const rateLimits = {
  // Para endpoints de autenticación (más restrictivo)
  auth: { limit: 5, windowMs: 60 * 1000 }, // 5 intentos por minuto
  
  // Para endpoints de API general
  api: { limit: 60, windowMs: 60 * 1000 },  // 60 solicitudes por minuto
  
  // Para endpoints de administración
  admin: { limit: 30, windowMs: 60 * 1000 }  // 30 solicitudes por minuto
};
