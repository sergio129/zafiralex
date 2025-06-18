import { NextRequest, NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile, generateId } from '@/lib/fileUtils';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { Testimonial } from '@/data/testimonials';

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);
const existsAsync = promisify(fs.exists);

// Define rutas a archivos
const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'testimonials');
const TESTIMONIALS_FILE = path.join(DATA_DIR, 'testimonials.json');

// Asegurar que el directorio de subidas existe
async function ensureUploadsDir() {
  if (!await existsAsync(UPLOADS_DIR)) {
    await mkdirAsync(UPLOADS_DIR, { recursive: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Asegurar que existe el directorio de subidas
    await ensureUploadsDir();

    const formData = await req.formData();
    
    // Extraer datos del formulario
    const name = formData.get('name') as string;
    const company = formData.get('company') as string;
    const position = formData.get('position') as string;
    const content = formData.get('content') as string;
    const type = formData.get('type') as 'text' | 'video';
    const videoUrl = formData.get('videoUrl') as string | null;
    const rating = parseInt(formData.get('rating') as string) || 5;
    const imageFile = formData.get('image') as File | null;
    
    // Validar datos básicos
    if (!name || !content || !type) {
      return NextResponse.json(
        { message: 'Nombre, contenido y tipo son requeridos' },
        { status: 400 }
      );
    }
    
    // Validar datos adicionales según el tipo
    if (type === 'video' && !videoUrl) {
      return NextResponse.json(
        { message: 'La URL del video es requerida para testimonios de tipo video' },
        { status: 400 }
      );
    }
    
    // Leer testimonios existentes
    const testimonials = await readJsonFile<Testimonial[]>(TESTIMONIALS_FILE, []);

    // Crear nuevo testimonio
    const newTestimonialId = generateId();
    
    let imagePath = '';
    
    // Procesar imagen si se proporcionó
    if (imageFile && imageFile instanceof File) {
      const fileExtension = imageFile.name.split('.').pop();
      const fileName = `${newTestimonialId}.${fileExtension}`;
      const filePath = path.join(UPLOADS_DIR, fileName);
      
      // Guardar archivo
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await writeFileAsync(filePath, buffer);
      
      // Ruta relativa para el frontend
      imagePath = `/uploads/testimonials/${fileName}`;
    }
    
    // Crear objeto de testimonio
    const newTestimonial: Testimonial = {
      id: newTestimonialId,
      name,
      company,
      position,
      content,
      type,
      rating
    };
    
    // Añadir datos opcionales
    if (imagePath) {
      newTestimonial.image = imagePath;
    }
    
    if (type === 'video' && videoUrl) {
      newTestimonial.videoUrl = videoUrl;
    }
    
    // Añadir a la lista y guardar
    testimonials.push(newTestimonial);
    await writeJsonFile(TESTIMONIALS_FILE, testimonials);
    
    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    console.error('Error al crear testimonio:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
