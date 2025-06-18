import { NextResponse } from 'next/server';
import { readJsonFile } from '@/lib/fileUtils';
import path from 'path';
import { Testimonial } from '@/data/testimonials';

// Define rutas a archivos
const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const TESTIMONIALS_FILE = path.join(DATA_DIR, 'testimonials.json');

export async function GET() {
  try {
    // Leer testimonios
    const testimonios = await readJsonFile<Testimonial[]>(TESTIMONIALS_FILE, []);
    
    return NextResponse.json(testimonios, { status: 200 });
  } catch (error) {
    console.error('Error al obtener testimonios:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
