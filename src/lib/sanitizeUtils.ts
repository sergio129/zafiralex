/**
 * Utilidad para sanitización de entradas de usuario
 * Proporciona funciones para prevenir ataques de XSS y SQL Injection
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitiza texto para prevenir ataques XSS
 * @param input - Texto a sanitizar
 * @returns Texto sanitizado
 */
export function sanitizeHTML(input: string): string {
  if (!input) return '';
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'target', 'title', 'rel']
  });
}

/**
 * Sanitiza texto plano eliminando cualquier etiqueta HTML
 * @param input - Texto a sanitizar
 * @returns Texto sanitizado
 */
export function sanitizeText(input: string): string {
  if (!input) return '';
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

/**
 * Sanitiza un objeto completo (recursivamente)
 * @param data - Objeto a sanitizar
 * @param options - Opciones adicionales de sanitización 
 * @returns Objeto sanitizado
 */
export function sanitizeObject<T extends Record<string, any>>(
  data: T, 
  options: {
    htmlFields?: string[]; // Campos que permiten HTML limitado
    skipFields?: string[]; // Campos que no deben ser sanitizados (ej: contraseñas hasheadas)
  } = {}
): T {
  if (!data || typeof data !== 'object') return data;
  
  const { htmlFields = [], skipFields = [] } = options;
  const result = { ...data };
  
  for (const key in data) {
    if (skipFields.includes(key)) {
      // No sanitizar campos específicos (ej: passwords ya hasheados)
      continue;
    } else if (typeof data[key] === 'string') {
      // Sanitizar strings según el tipo de campo
      if (htmlFields.includes(key)) {
        result[key as keyof T] = sanitizeHTML(data[key]) as unknown as T[keyof T];
      } else {
        result[key as keyof T] = sanitizeText(data[key]) as unknown as T[keyof T];
      }
    } else if (typeof data[key] === 'object' && data[key] !== null) {
      // Sanitizar objetos anidados recursivamente
      result[key as keyof T] = sanitizeObject(data[key], options) as unknown as T[keyof T];
    }
  }
  
  return result;
}

/**
 * Sanitiza parámetros para evitar SQL injection
 * Prisma utiliza parámetros preparados, pero esta es una capa adicional de seguridad
 * @param input - Entrada a sanitizar
 * @returns Entrada sanitizada
 */
export function sanitizeSQLParam(input: string): string {
  if (!input) return '';
  // Elimina caracteres que podrían usarse en SQL injection
  return input
    .replace(/['";\\]/g, '') // Eliminar comillas y punto y coma
    .replace(/--/g, '')      // Eliminar comentarios SQL
    .replace(/\/\*/g, '')    // Eliminar comentarios de bloque
    .replace(/\*\//g, '');   // Eliminar fin de comentarios de bloque
}

/**
 * Wrapper para validar parámetros de ID
 * @param id - ID a validar
 * @returns ID validado o null si no es válido
 */
export function validateId(id: string | undefined | null): string | null {
  if (!id) return null;
  
  // Validar formato de ID (alfanumérico + caracteres especiales comunes en IDs)
  // Ajustar esta expresión regular según el formato de IDs de tu aplicación
  const idRegex = /^[a-zA-Z0-9_-]+$/;
  
  if (!idRegex.test(id)) {
    return null;
  }
  
  return sanitizeSQLParam(id);
}

/**
 * Valida y sanitiza parámetros de URL
 * @param params - Parámetros a sanitizar 
 * @returns Parámetros sanitizados
 */
export function sanitizeURLParams<T extends Record<string, string>>(params: T): Record<string, string> {
  const sanitized: Record<string, string> = {};
  
  for (const key in params) {
    sanitized[key] = sanitizeSQLParam(params[key]);
  }
  
  return sanitized as T;
}
