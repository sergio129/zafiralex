import { NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile, generateId, slugify } from '@/lib/fileUtils';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { NewsItem } from '@/components/ui/NewsCard';

const writeFileAsync = promisify(fs.writeFile);
// Renombramos para evitar el error de variable no utilizada
const _unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);
const existsAsync = promisify(fs.exists);

// Verificar si estamos en Vercel
const isVercel = process.env.VERCEL === '1';
console.log(`Entorno de ejecución: ${isVercel ? 'Vercel' : 'Local'}`);

// Define rutas a archivos
const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'news');
const NEWS_FILE = path.join(DATA_DIR, 'news.json');

// Logging para debug
console.log(`DATA_DIR: ${DATA_DIR}`);
console.log(`UPLOADS_DIR: ${UPLOADS_DIR}`);
console.log(`NEWS_FILE: ${NEWS_FILE}`);

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

    // Leer noticias existentes
    const news = await readJsonFile<NewsItem[]>(NEWS_FILE, []);

    // Crear nueva noticia
    const newNewsId = generateId();
    const slug = slugify(title);
    const date = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    
    let imagePath = '';    // Procesar imagen si se proporcionó
    if (imageFile && imageFile instanceof File) {
      try {
        const fileExtension = imageFile.name.split('.').pop();
        const fileName = `${newNewsId}.${fileExtension}`;
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
    
    // Crear objeto de noticia
    const newNews: NewsItem = {
      id: newNewsId,
      title,
      summary,
      content,
      date,
      image: imagePath,
      category,
      slug
    };
      // Añadir a la lista y guardar
    news.push(newNews);
    
    try {
      await writeJsonFile(NEWS_FILE, news);
      console.log('Archivo JSON guardado exitosamente');
    } catch (jsonError) {
      console.error('Error al escribir archivo JSON:', jsonError);
      // Si falla la escritura al archivo, al menos devolvemos la noticia creada
    }
    
    return NextResponse.json(newNews, { status: 201 });
  } catch (error) {
    console.error('Error al crear noticia:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
