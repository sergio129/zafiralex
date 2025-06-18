import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { withAuth } from '@/lib/authMiddleware';

const readFileAsync = promisify(fs.readFile);
const existsAsync = promisify(fs.exists);

// Define rutas a archivos
const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const NEWS_FILE = path.join(DATA_DIR, 'news.json');
const TESTIMONIALS_FILE = path.join(DATA_DIR, 'testimonials.json');

// Tipamos correctamente para evitar el error de 'any'
async function readJsonFile(filePath: string, defaultValue: Record<string, unknown>[] | unknown[]) {
  try {
    if (await existsAsync(filePath)) {
      const data = await readFileAsync(filePath, 'utf-8');
      return JSON.parse(data);
    }
    return defaultValue;
  } catch (error) {
    console.error(`Error al leer archivo JSON: ${filePath}`, error);
    return defaultValue;
  }
}

export const GET = withAuth(async (_req: NextRequest) => {
  try {
    // Leer datos
    const news = await readJsonFile(NEWS_FILE, []);
    const testimonials = await readJsonFile(TESTIMONIALS_FILE, []);

    // Construir estadísticas
    const stats = {
      newsCount: news.length,
      testimonialsCount: testimonials.length
    };    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
});
