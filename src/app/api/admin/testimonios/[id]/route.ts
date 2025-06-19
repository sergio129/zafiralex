import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { prisma } from '@/lib/prisma';

const unlinkAsync = promisify(fs.unlink);
const writeFileAsync = promisify(fs.writeFile);
const existsAsync = promisify(fs.exists);

// Verificar si estamos en Vercel
const isVercel = process.env.VERCEL === '1';
console.log(`Entorno de ejecución: ${isVercel ? 'Vercel' : 'Local'}`);

// Define rutas a archivos
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'testimonials');

// Logging para debug
console.log(`UPLOADS_DIR: ${UPLOADS_DIR}`);

// Función adaptada para guardar archivos en Vercel
async function saveFileWithVercelCheck(filePath: string, buffer: Buffer): Promise<string> {
  // Si estamos en Vercel, no podemos guardar archivos permanentemente
  if (isVercel) {
    console.log('Ejecutando en Vercel - no se puede guardar archivos localmente');
    // En una implementación real, aquí deberíamos usar un servicio de almacenamiento
    // como Amazon S3, Cloudinary, Vercel Blob, etc.
    
    // Por ahora, simulamos éxito pero regresamos una ruta genérica
    return '/uploads/testimonials/placeholder.jpg';
  }
  
  // Si no estamos en Vercel, procedemos normalmente
  await writeFileAsync(filePath, buffer);
  console.log(`Archivo guardado exitosamente en: ${filePath}`);
  
  const relativePath = filePath.split('/public')[1] || filePath.split('\\public\\')[1];
  return relativePath;
}

// Utilizamos una definición de tipos más simple para evitar problemas de compilación
type Params = { id: string };

export async function GET(request: Request) {
  try {
    // Extraer el ID de la URL en lugar de los parámetros
    const id = request.url.split('/').pop() as string;
    
    // Buscar testimonio en la base de datos
    const testimonial = await prisma.testimonial.findUnique({
      where: { id }
    });
    
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

export async function PUT(request: Request) {
  try {
    console.log('Iniciando actualización de testimonio');
    // Extraer el ID de la URL en lugar de los parámetros
    const id = request.url.split('/').pop() as string;
    console.log(`ID del testimonio a actualizar: ${id}`);
    
    const formData = await request.formData();
    console.log('FormData recibido');
    
    // Extraer datos del formulario
    const name = formData.get('name') as string;
    const company = formData.get('company') as string;
    const position = formData.get('position') as string;
    const content = formData.get('content') as string;
    const type = formData.get('type') as 'text' | 'video';
    const videoUrl = formData.get('videoUrl') as string | null;
    const rating = parseInt(formData.get('rating') as string) || 5;
    const imageFile = formData.get('image') as File | null;
    
    console.log('Datos del formulario extraídos:', { name, company, position, type, rating });
    
    // Validar datos básicos
    if (!name || !content || !type) {
      console.log('Error de validación: Datos incompletos');
      return NextResponse.json(
        { message: 'Nombre, contenido y tipo son requeridos' },
        { status: 400 }
      );
    }
    
    // Validar datos adicionales según el tipo
    if (type === 'video' && !videoUrl) {
      console.log('Error de validación: Falta URL de video');
      return NextResponse.json(
        { message: 'La URL del video es requerida para testimonios de tipo video' },
        { status: 400 }
      );
    }
    
    // Verificar si el testimonio existe en la base de datos
    const testimonial = await prisma.testimonial.findUnique({
      where: { id }
    });
    
    if (!testimonial) {
      console.log('Testimonio no encontrado');
      return NextResponse.json(
        { message: 'Testimonio no encontrado' },
        { status: 404 }
      );
    }
    
    // Preparar datos para actualizar
    const updateData: any = {
      name,
      company,
      position,
      content,
      type,
      rating
    };
    
    // Actualizar URL de video si es testimonio de tipo video
    if (type === 'video') {
      updateData.videoUrl = videoUrl;
    } else {
      // Si cambia de video a texto, eliminar URL de video
      updateData.videoUrl = null;
    }
    
    // Procesar nueva imagen si se proporcionó
    if (imageFile && imageFile instanceof File) {
      console.log('Procesando nueva imagen');
      
      // Eliminar imagen anterior si existe (solo en entorno local)
      if (!isVercel && testimonial.image?.startsWith('/uploads/')) {
        try {
          console.log('Intentando eliminar imagen anterior');
          const oldImagePath = path.join(process.cwd(), 'public', testimonial.image);
          if (await existsAsync(oldImagePath)) {
            await unlinkAsync(oldImagePath);
            console.log('Imagen anterior eliminada');
          }
        } catch (err) {
          console.error('Error al eliminar imagen anterior:', err);
          // Continuamos aunque falle la eliminación
        }
      }
      
      try {
        // Guardar nueva imagen
        const fileExtension = imageFile.name.split('.').pop();
        const fileName = `${id}.${fileExtension}`;
        const filePath = path.join(UPLOADS_DIR, fileName);
        
        console.log('Procesando imagen:', fileExtension, fileName);
        
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Usar nuestra función adaptada para Vercel
        const imagePath = await saveFileWithVercelCheck(filePath, buffer);
        console.log('Ruta de imagen establecida:', imagePath);
        
        // Actualizar ruta de imagen
        updateData.image = imagePath;
      } catch (imageError) {
        console.error('Error al procesar imagen:', imageError);
        // Continuamos con la imagen anterior si hay error
      }
    }
    
    // Actualizar en la base de datos
    console.log('Actualizando testimonio en la base de datos');
    const updatedTestimonial = await prisma.testimonial.update({
      where: { id },
      data: updateData
    });
    
    return NextResponse.json(updatedTestimonial, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar testimonio:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Extraer el ID de la URL en lugar de los parámetros
    const id = request.url.split('/').pop() as string;
    
    // Buscar testimonio por ID
    const testimonial = await prisma.testimonial.findUnique({
      where: { id }
    });
    
    if (!testimonial) {
      return NextResponse.json(
        { message: 'Testimonio no encontrado' },
        { status: 404 }
      );
    }
    
    // Eliminar imagen si existe (solo en entorno local)
    if (!isVercel && testimonial.image?.startsWith('/uploads/')) {
      try {
        const imagePath = path.join(process.cwd(), 'public', testimonial.image);
        if (await existsAsync(imagePath)) {
          await unlinkAsync(imagePath);
        }
      } catch (err) {
        console.error('Error al eliminar imagen:', err);
      }
    }
    
    // Eliminar testimonio de la base de datos
    await prisma.testimonial.delete({
      where: { id }
    });
    
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
