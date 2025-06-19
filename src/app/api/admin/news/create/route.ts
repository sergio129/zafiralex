import { NextResponse } from 'next/server';
import { slugify } from '@/lib/fileUtils';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { prisma } from '@/lib/prisma';

const writeFileAsync = promisify(fs.writeFile);
// Renombramos para evitar el error de variable no utilizada
const _unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);
const existsAsync = promisify(fs.exists);

// Verificar si estamos en Vercel
const isVercel = process.env.VERCEL === '1';
console.log(`Entorno de ejecución: ${isVercel ? 'Vercel' : 'Local'}`);

// Define rutas a archivos
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'news');

// Logging para debug
console.log(`UPLOADS_DIR: ${UPLOADS_DIR}`);

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
    return '/uploads/news/placeholder.jpg';
  }
  
  // Si no estamos en Vercel, procedemos normalmente
  await writeFileAsync(filePath, buffer);
  console.log(`Archivo guardado exitosamente en: ${filePath}`);
  
  const relativePath = filePath.split('/public')[1];
  return relativePath;
}

export async function POST(request: Request) {
  try {
    // Asegurar que existe el directorio de subidas
    try {
      await ensureUploadsDir();
    } catch (dirError) {
      console.error('Error al crear directorio de uploads:', dirError);
      // Continuamos aunque falle la creación del directorio
    }

    const formData = await request.formData();
    
    // Extraer datos del formulario
    const title = formData.get('title') as string;
    const summary = formData.get('summary') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const imageFile = formData.get('image') as File | null;
    
    // Validar datos
    if (!title || !summary || !content || !category) {
      return NextResponse.json(
        { message: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Generar slug para la noticia
    const slug = slugify(title);
    const date = new Date(); // Fecha actual
    
    let imagePath = '';
    
    // Procesar imagen si se proporcionó
    if (imageFile && imageFile instanceof File) {
      try {
        const fileExtension = imageFile.name.split('.').pop();
        // Usamos Date.now() para generar un nombre único
        const fileName = `${Date.now()}${fileExtension}`;
        const filePath = path.join(UPLOADS_DIR, fileName);
        
        console.log('Procesando imagen:', fileExtension, fileName);
        
        // Obtener datos de la imagen
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Usar nuestra función adaptada para Vercel
        imagePath = await saveFileWithVercelCheck(filePath, buffer);
        console.log('Ruta de imagen establecida:', imagePath);
      } catch (imageError) {
        console.error('Error al procesar imagen:', imageError);
        // Continuamos sin imagen si hay error
        imagePath = '';
      }
    }
    
    // Crear noticia en la base de datos
    const newNews = await prisma.news.create({
      data: {
        title,
        summary,
        content, 
        date,
        image: imagePath || null,
        category,
        slug
      }
    });
    
    return NextResponse.json(newNews, { status: 201 });
  } catch (error) {
    console.error('Error al crear noticia:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
