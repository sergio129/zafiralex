import { NextRequest, NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile, slugify } from '@/lib/fileUtils';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { NewsItem } from '@/components/ui/NewsCard';

const unlinkAsync = promisify(fs.unlink);

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'news');
const NEWS_FILE = path.join(DATA_DIR, 'news.json');

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {  try {
    const { id } = context.params;
    const news = await readJsonFile<NewsItem[]>(NEWS_FILE, []);
    const newsItem = news.find(item => item.id === id);

    if (!newsItem) {
      return NextResponse.json({ message: 'Noticia no encontrada' }, { status: 404 });
    }

    return NextResponse.json(newsItem, { status: 200 });
  } catch (error) {
    console.error('Error al obtener noticia:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const formData = await req.formData();

    const title = formData.get('title') as string;
    const summary = formData.get('summary') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const imageFile = formData.get('image') as File | null;

    if (!title || !summary || !content || !category) {
      return NextResponse.json({ message: 'Todos los campos son requeridos' }, { status: 400 });
    }

    const news = await readJsonFile<NewsItem[]>(NEWS_FILE, []);
    const index = news.findIndex(item => item.id === id);

    if (index === -1) {
      return NextResponse.json({ message: 'Noticia no encontrada' }, { status: 404 });
    }

    const updatedNews = { ...news[index] };
    updatedNews.title = title;
    updatedNews.summary = summary;
    updatedNews.content = content;
    updatedNews.category = category;
    updatedNews.slug = slugify(title);

    if (imageFile && imageFile instanceof File) {
      if (updatedNews.image?.startsWith('/uploads/')) {
        try {
          const oldImagePath = path.join(process.cwd(), 'public', updatedNews.image);
          await unlinkAsync(oldImagePath);
        } catch (err) {
          console.error('Error al eliminar imagen anterior:', err);
        }
      }

      const fileExtension = imageFile.name.split('.').pop();
      const fileName = `${id}.${fileExtension}`;
      const filePath = path.join(UPLOADS_DIR, fileName);

      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.promises.writeFile(filePath, buffer);

      updatedNews.image = `/uploads/news/${fileName}`;
    }

    news[index] = updatedNews;
    await writeJsonFile(NEWS_FILE, news);

    return NextResponse.json(updatedNews, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar noticia:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {  try {
    const { id } = context.params;
    const news = await readJsonFile<NewsItem[]>(NEWS_FILE, []);
    const index = news.findIndex(item => item.id === id);

    if (index === -1) {
      return NextResponse.json({ message: 'Noticia no encontrada' }, { status: 404 });
    }

    const imageToDelete = news[index].image;
    if (imageToDelete?.startsWith('/uploads/')) {
      try {
        const imagePath = path.join(process.cwd(), 'public', imageToDelete);
        await unlinkAsync(imagePath);
      } catch (err) {
        console.error('Error al eliminar imagen:', err);
      }
    }

    news.splice(index, 1);
    await writeJsonFile(NEWS_FILE, news);

    return NextResponse.json({ message: 'Noticia eliminada correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar noticia:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
