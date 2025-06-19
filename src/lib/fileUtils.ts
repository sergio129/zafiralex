import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import crypto from 'crypto';
import { execSync } from 'child_process';

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
    if (!await existsAsync(dirPath)) {
      await mkdirAsync(dirPath, { recursive: true });
    }
  } catch (error) {
    console.error(`Error ensuring directory exists: ${dirPath}`, error);
    throw error;
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
    console.log(`Intentando escribir en archivo: ${filePath}`);
    
    // Verificar si el directorio existe
    const dir = path.dirname(filePath);
    console.log(`Verificando directorio: ${dir}`);
    
    try {
      await ensureDirExists(dir);
    } catch (dirError) {
      console.error(`Error al crear directorio ${dir}:`, dirError);
    }
    
    // Escribir el archivo
    console.log('Escribiendo datos al archivo...');
    await writeFileAsync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Archivo escrito exitosamente');
    
    // Si estamos en Vercel y es un archivo JSON importante, hacemos un commit y push automático
    // Esto solo funcionará si configuramos correctamente los permisos y tokens en Vercel
    if (isVercel && 
        (filePath.includes('testimonials.json') || filePath.includes('news.json'))) {
      try {
        console.log('Intentando actualizar repositorio remoto con cambios...');
        
        // Nota: Esto es un ejemplo conceptual, no funcionará directamente en Vercel sin configuración adicional
        // Requeriría tokens de acceso a GitHub y configuración de Git en el entorno

        
        // En vez de intentar actualizar el repositorio directamente (que es complicado en Vercel),
        // mostraremos un mensaje indicando que esta funcionalidad requiere implementación adicional
        console.log('Para que los cambios persistan en Vercel, se necesita implementar una solución de almacenamiento persistente como:');
        console.log('1. Usar Vercel KV Store o Vercel Blob Storage');
        console.log('2. Implementar una base de datos externa (MongoDB, PostgreSQL, etc.)');
        console.log('3. Usar un servicio de almacenamiento de archivos (S3, Firebase Storage, etc.)');
      } catch (gitError) {
        console.error('Error al actualizar repositorio:', gitError);
      }
    }
  } catch (error) {
    console.error(`Error writing JSON file: ${filePath}`, error);
    throw error;
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
