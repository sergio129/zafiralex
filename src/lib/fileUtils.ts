import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import crypto from 'crypto';

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
    await ensureDirExists(path.dirname(filePath));
    await writeFileAsync(filePath, JSON.stringify(data, null, 2), 'utf-8');
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
