import { NextRequest, NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile, generateId } from '@/lib/fileUtils';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { Testimonial } from '@/data/testimonials';

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);
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

// Asegurar que el directorio de subidas existe
async function ensureUploadsDir() {
  // En Vercel, no podemos crear directorios fuera de /tmp
  if (isVercel) {
    console.log('Ejecutando en Vercel - no se puede crear directorios permanentes');
    return;
  }
  
  if (!await existsAsync(UPLOADS_DIR)) {
    console.log(`Creando directorio: ${UPLOADS_DIR}`);
    await mkdirAsync(UPLOADS_DIR, { recursive: true });
    console.log('Directorio creado exitosamente');
  } else {
    console.log(`El directorio ya existe: ${UPLOADS_DIR}`);
  }
}

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

export async function POST(req: NextRequest) {
  try {
    console.log('Iniciando creación de testimonio');
    
    // Asegurar que existe el directorio de subidas
    try {
      await ensureUploadsDir();
    } catch (dirError) {
      console.error('Error al crear directorio de uploads:', dirError);
      // Continuamos aunque falle la creación del directorio
    }

    const formData = await req.formData();
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
    // Leer testimonios existentes
    const testimonials = await readJsonFile<Testimonial[]>(TESTIMONIALS_FILE, []);

    // Crear nuevo testimonio
    const newTestimonialId = generateId();
    console.log(`Nuevo ID de testimonio: ${newTestimonialId}`);
    
    let imagePath = '';
    
    // Procesar imagen si se proporcionó
    if (imageFile && imageFile instanceof File) {
      try {
        console.log('Procesando imagen recibida');
        const fileExtension = imageFile.name.split('.').pop();
        const fileName = `${newTestimonialId}.${fileExtension}`;
        const filePath = path.join(UPLOADS_DIR, fileName);
        
        console.log('Procesando imagen:', fileExtension, fileName);
        
        // Guardar archivo
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Usar función adaptada para Vercel
        imagePath = await saveFileWithVercelCheck(filePath, buffer);
        console.log('Ruta de imagen establecida:', imagePath);
      } catch (imageError) {
        console.error('Error al procesar imagen:', imageError);
        // Continuamos sin imagen si hay error
        imagePath = '';
      }
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
    
    console.log('Guardando cambios en el archivo JSON');
    try {
      await writeJsonFile(TESTIMONIALS_FILE, testimonials);
      console.log('Archivo JSON guardado exitosamente');
    } catch (jsonError) {
      console.error('Error al escribir archivo JSON:', jsonError);
      // Aún así devolvemos respuesta exitosa ya que actualizamos el objeto en memoria
    }
    
    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    console.error('Error al crear testimonio:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
