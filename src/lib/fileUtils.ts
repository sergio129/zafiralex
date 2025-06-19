import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import crypto from 'crypto';

// Verificar si estamos en Vercel
const isVercel = process.env.VERCEL === '1';
console.log(`Entorno de ejecución: ${isVercel ? 'Vercel' : 'Local'}`);

// Promisify fs functions
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);
const existsAsync = promisify(fs.exists);

// Ensure directory exists
export async function ensureDirExists(dirPath: string): Promise<void> {
  try {
    // En Vercel, no intentamos crear directorios fuera de /tmp
    if (isVercel && !dirPath.startsWith('/tmp')) {
      console.log(`No se puede crear directorio ${dirPath} en Vercel fuera de /tmp`);
      return;
    }

    if (!await existsAsync(dirPath)) {
      await mkdirAsync(dirPath, { recursive: true });
    }
  } catch (error) {
    console.error(`Error ensuring directory exists: ${dirPath}`, error);
    // No lanzamos el error para poder continuar la ejecución
  }
}

// Read data from JSON file
export async function readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    if (!await existsAsync(filePath)) {
      return defaultValue;
    }
    const data = await readFileAsync(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error reading JSON file: ${filePath}`, error);
    return defaultValue;
  }
}

// Write data to JSON file
export async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  try {
    // Log para debugging
    console.log(`Intentando escribir en archivo: ${filePath}`);
    
    // Si estamos en Vercel, y tratamos de escribir en un archivo que no está en /tmp
    if (isVercel && !filePath.startsWith('/tmp')) {
      console.log(`Advertencia: Intentando escribir en archivo no temporal en Vercel: ${filePath}`);
      console.log('En entorno de producción, se debería usar un servicio de almacenamiento externo');
      
      // Crear una versión temporal del archivo para mantener la consistencia durante la ejecución
      const tmpPath = path.join('/tmp', path.basename(filePath));
      console.log(`Escribiendo a archivo temporal: ${tmpPath}`);
      
      try {
        await writeFileAsync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`Archivo temporal escrito exitosamente: ${tmpPath}`);
      } catch (tmpError) {
        console.error(`Error escribiendo archivo temporal: ${tmpPath}`, tmpError);
      }
      
      // Intentamos continuar con la escritura al archivo original para entorno de desarrollo
      // pero no bloqueamos si falla
    }
    
    // Verificar si el directorio existe
    const dir = path.dirname(filePath);
    console.log(`Verificando directorio: ${dir}`);
    
    try {
      await ensureDirExists(dir);
    } catch (dirError) {
      console.error(`Error al crear directorio ${dir}:`, dirError);
      // Continuamos a pesar del error
    }
    
    // Escribir el archivo
    console.log('Escribiendo datos al archivo...');
    await writeFileAsync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Archivo escrito exitosamente');
  } catch (error) {
    console.error(`Error writing JSON file: ${filePath}`, error);
    // No lanzamos el error para permitir que la aplicación continúe funcionando
    // incluso si la escritura del archivo falla
  }
}

// Simple hashing function for passwords
export function hashPassword(password: string): string {
  return crypto
    .createHash('sha256')
    .update(password)
    .digest('hex');
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
}

// Slugify a string (convert to URL-friendly format)
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-)|(-$)/g, '');
}

// Format date to YYYY-MM-DD
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
