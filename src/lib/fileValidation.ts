/**
 * Utilidad para validar la seguridad de archivos subidos
 * Proporciona funciones para validar imágenes y otros archivos
 */

// Tipos MIME permitidos para imágenes
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
];

// Tamaño máximo de archivo en bytes (5MB por defecto)
const MAX_FILE_SIZE = 5 * 1024 * 1024; 

/**
 * Opciones para validación de imágenes
 */
export interface ImageValidationOptions {
  maxSizeBytes?: number;
  allowedTypes?: string[];
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

/**
 * Resultado de la validación de archivos
 */
export interface FileValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Valida una imagen para prevenir ataques a través de archivos maliciosos
 * @param file - Archivo a validar
 * @param options - Opciones de validación
 */
export async function validateImage(
  file: File,
  options: ImageValidationOptions = {}
): Promise<FileValidationResult> {
  const result: FileValidationResult = {
    valid: true,
    errors: []
  };
  
  const {
    maxSizeBytes = MAX_FILE_SIZE,
    allowedTypes = ALLOWED_IMAGE_TYPES,
  } = options;
  
  // Verificar tipo MIME
  if (!allowedTypes.includes(file.type)) {
    result.valid = false;
    result.errors.push(`Tipo de archivo no permitido: ${file.type}. Tipos permitidos: ${allowedTypes.join(', ')}`);
  }
  
  // Verificar tamaño de archivo
  if (file.size > maxSizeBytes) {
    result.valid = false;
    result.errors.push(`El archivo excede el tamaño máximo permitido de ${maxSizeBytes / 1024 / 1024}MB`);
  }
  
  // Verificar que sea realmente una imagen (verificación básica del encabezado de archivo)
  try {
    const arrayBuffer = await file.slice(0, 4).arrayBuffer();
    const header = new Uint8Array(arrayBuffer);
    
    // Verificar firmas comunes de archivos de imagen
    const isPNG = header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47;
    const isJPEG = header[0] === 0xFF && header[1] === 0xD8;
    const isGIF = header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46;
    const isWEBP = header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46;
    
    // Si el tipo MIME indica una imagen pero el encabezado no coincide, rechazar
    if (file.type.startsWith('image/') && !(isPNG || isJPEG || isGIF || isWEBP)) {
      result.valid = false;
      result.errors.push('El archivo no parece ser una imagen válida');
    }
  } catch (error) {
    result.valid = false;
    result.errors.push(`Error al validar el contenido de la imagen: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  return result;
}

/**
 * Sanitiza el nombre de archivo para prevenir ataques de path traversal
 * @param filename - Nombre de archivo a sanitizar
 * @returns Nombre de archivo sanitizado
 */
export function sanitizeFileName(filename: string): string {
  // Eliminar caracteres que podrían usarse para path traversal
  return filename
    .replace(/[/\\]/g, '_')              // Reemplazar barras con guiones bajos
    .replace(/\.\./g, '_')               // Reemplazar .. con guiones bajos
    .replace(/[^a-zA-Z0-9\-_\.]/g, '_'); // Permitir solo caracteres alfanuméricos, guiones, guiones bajos y puntos
}

/**
 * Genera un nombre de archivo seguro y único
 * @param originalFilename - Nombre original del archivo
 * @returns Nombre de archivo seguro y único
 */
export function generateSecureFileName(originalFilename: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const sanitizedName = sanitizeFileName(originalFilename);
  const extension = sanitizedName.split('.').pop() ?? '';
  
  return `${timestamp}${randomString}.${extension}`;
}
