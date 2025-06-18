import { NextResponse } from 'next/server';
import { readJsonFile } from '@/lib/fileUtils';
import path from 'path';

// Define rutas a archivos
const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const NEWS_FILE = path.join(DATA_DIR, 'news.json');

export async function GET() {
  try {
    // Leer noticias
    const news = await readJsonFile(NEWS_FILE, []);
    
    return NextResponse.json(news, { status: 200 });
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
