import { NextRequest, NextResponse } from 'next/server';
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

// Define rutas a archivos
const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'news');
const NEWS_FILE = path.join(DATA_DIR, 'news.json');

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
    
    let imagePath = '';
    
    // Procesar imagen si se proporcionó
    if (imageFile && imageFile instanceof File) {
      const fileExtension = imageFile.name.split('.').pop();
      const fileName = `${newNewsId}.${fileExtension}`;
      const filePath = path.join(UPLOADS_DIR, fileName);
      
      // Guardar archivo
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await writeFileAsync(filePath, buffer);
      
      // Ruta relativa para el frontend
      imagePath = `/uploads/news/${fileName}`;
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
    await writeJsonFile(NEWS_FILE, news);
    
    return NextResponse.json(newNews, { status: 201 });
  } catch (error) {
    console.error('Error al crear noticia:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
