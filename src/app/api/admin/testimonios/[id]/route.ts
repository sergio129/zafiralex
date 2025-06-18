import { NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile } from '@/lib/fileUtils';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { Testimonial } from '@/data/testimonials';

const unlinkAsync = promisify(fs.unlink);

// Define rutas a archivos
const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'testimonials');
const TESTIMONIALS_FILE = path.join(DATA_DIR, 'testimonials.json');

export async function GET(
  request: Request,
  // @ts-ignore
  { params }
) {
  try {
    const { id } = params;
    
    // Leer testimonios
    const testimonials = await readJsonFile<Testimonial[]>(TESTIMONIALS_FILE, []);
    
    // Buscar testimonio por ID
    const testimonial = testimonials.find(item => item.id === id);
    
    if (!testimonial) {
      return NextResponse.json(
        { message: 'Testimonio no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(testimonial, { status: 200 });
  } catch (error) {
    console.error('Error al obtener testimonio:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  // @ts-ignore
  { params }
) {
  try {
    const { id } = params;
    const formData = await request.formData();
    
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
    
    // Leer testimonios
    const testimonials = await readJsonFile<Testimonial[]>(TESTIMONIALS_FILE, []);
    
    // Buscar testimonio por ID
    const index = testimonials.findIndex(item => item.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { message: 'Testimonio no encontrado' },
        { status: 404 }
      );
    }
    
    // Actualizar testimonio
    const updatedTestimonial: Testimonial = {
      ...testimonials[index],
      name,
      company,
      position,
      content,
      type,
      rating
    };
    
    // Actualizar URL de video si es testimonio de tipo video
    if (type === 'video') {
      updatedTestimonial.videoUrl = videoUrl ?? '';
    } else {
      // Si cambia de video a texto, eliminar URL de video
      delete updatedTestimonial.videoUrl;
    }
    
    // Procesar nueva imagen si se proporcionó
    if (imageFile && imageFile instanceof File) {
      // Eliminar imagen anterior si existe
      if (updatedTestimonial.image?.startsWith('/uploads/')) {
        try {
          const oldImagePath = path.join(process.cwd(), 'public', updatedTestimonial.image);
          await unlinkAsync(oldImagePath);
        } catch (err) {
          console.error('Error al eliminar imagen anterior:', err);
        }
      }
      
      // Guardar nueva imagen
      const fileExtension = imageFile.name.split('.').pop();
      const fileName = `${id}.${fileExtension}`;
      const filePath = path.join(UPLOADS_DIR, fileName);
      
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.promises.writeFile(filePath, buffer);
      
      // Actualizar ruta de imagen
      updatedTestimonial.image = `/uploads/testimonials/${fileName}`;
    }
    
    // Actualizar en la lista y guardar
    testimonials[index] = updatedTestimonial;
    await writeJsonFile(TESTIMONIALS_FILE, testimonials);
    
    return NextResponse.json(updatedTestimonial, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar testimonio:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  // @ts-ignore
  { params }
) {
  try {
    const { id } = params;
    
    // Leer testimonios
    const testimonials = await readJsonFile<Testimonial[]>(TESTIMONIALS_FILE, []);
    
    // Buscar testimonio por ID
    const index = testimonials.findIndex(item => item.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { message: 'Testimonio no encontrado' },
        { status: 404 }
      );
    }
    
    // Eliminar imagen si existe
    const imageToDelete = testimonials[index].image;
    if (imageToDelete?.startsWith('/uploads/')) {
      try {
        const imagePath = path.join(process.cwd(), 'public', imageToDelete);
        await unlinkAsync(imagePath);
      } catch (err) {
        console.error('Error al eliminar imagen:', err);
      }
    }
    
    // Eliminar testimonio
    testimonials.splice(index, 1);
    await writeJsonFile(TESTIMONIALS_FILE, testimonials);
    
    return NextResponse.json(
      { message: 'Testimonio eliminado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al eliminar testimonio:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
