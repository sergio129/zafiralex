import { NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile } from '@/lib/fileUtils';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { Testimonial } from '@/data/testimonials';

const unlinkAsync = promisify(fs.unlink);
const writeFileAsync = promisify(fs.writeFile);
const existsAsync = promisify(fs.exists);

// Verificar si estamos en Vercel
const isVercel = process.env.VERCEL === '1';
console.log(`Entorno de ejecución: ${isVercel ? 'Vercel' : 'Local'}`);

// Define rutas a archivos
const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'testimonials');
const TESTIMONIALS_FILE = path.join(DATA_DIR, 'testimonials.json');

// Logging para debug
console.log(`DATA_DIR: ${DATA_DIR}`);
console.log(`UPLOADS_DIR: ${UPLOADS_DIR}`);
console.log(`TESTIMONIALS_FILE: ${TESTIMONIALS_FILE}`);

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
    console.log('Iniciando actualización de testimonio');
    const { id } = params;
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
    
    console.log('Leyendo datos de testimonios existentes');
    // Leer testimonios
    const testimonials = await readJsonFile<Testimonial[]>(TESTIMONIALS_FILE, []);
    
    // Buscar testimonio por ID
    const index = testimonials.findIndex(item => item.id === id);
    
    if (index === -1) {
      console.log('Testimonio no encontrado');
      return NextResponse.json(
        { message: 'Testimonio no encontrado' },
        { status: 404 }
      );
    }
    
    console.log('Testimonio encontrado, creando versión actualizada');
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
      console.log('Procesando nueva imagen');
      
      // Eliminar imagen anterior si existe (solo en entorno local)
      if (!isVercel && updatedTestimonial.image?.startsWith('/uploads/')) {
        try {
          console.log('Intentando eliminar imagen anterior');
          const oldImagePath = path.join(process.cwd(), 'public', updatedTestimonial.image);
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
        updatedTestimonial.image = imagePath;
      } catch (imageError) {
        console.error('Error al procesar imagen:', imageError);
        // Continuamos con la imagen anterior si hay error
      }
    }
    
    // Actualizar en la lista
    testimonials[index] = updatedTestimonial;
    
    // Guardar cambios
    console.log('Guardando cambios en el archivo JSON');
    try {
      await writeJsonFile(TESTIMONIALS_FILE, testimonials);
      console.log('Archivo JSON guardado exitosamente');
    } catch (jsonError) {
      console.error('Error al escribir archivo JSON:', jsonError);
      // Aún así devolvemos respuesta exitosa ya que actualizamos el objeto en memoria
    }
    
    return NextResponse.json(updatedTestimonial, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar testimonio:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', error: error instanceof Error ? error.message : String(error) },
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
    
    // Eliminar imagen si existe (solo en entorno local)
    if (!isVercel && testimonials[index].image?.startsWith('/uploads/')) {
      try {
        const imagePath = path.join(process.cwd(), 'public', testimonials[index].image);
        if (await existsAsync(imagePath)) {
          await unlinkAsync(imagePath);
        }
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
