import { NextResponse } from 'next/server';
import { slugify } from '@/lib/fileUtils';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { prisma } from '@/lib/prisma';

const unlinkAsync = promisify(fs.unlink);

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'news');

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const newsItem = await prisma.news.findUnique({
      where: { id }
    });

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
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const summary = formData.get('summary') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const imageFile = formData.get('image') as File | null;

    if (!title || !summary || !content || !category) {
      return NextResponse.json({ message: 'Todos los campos son requeridos' }, { status: 400 });
    }

    // Verificamos si la noticia existe
    const existingNews = await prisma.news.findUnique({
      where: { id }
    });

    if (!existingNews) {
      return NextResponse.json({ message: 'Noticia no encontrada' }, { status: 404 });
    }

    let imagePath = existingNews.image;

    if (imageFile && imageFile instanceof File) {
      // Si hay una imagen anterior, intentamos eliminarla
      if (imagePath?.startsWith('/uploads/')) {
        try {
          const oldImagePath = path.join(process.cwd(), 'public', imagePath);
          await unlinkAsync(oldImagePath);
        } catch (err) {
          console.error('Error al eliminar imagen anterior:', err);
        }
      }

      const fileExtension = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExtension}`;
      const filePath = path.join(UPLOADS_DIR, fileName);

      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.promises.writeFile(filePath, buffer);

      imagePath = `/uploads/news/${fileName}`;
    }

    // Actualizar en la base de datos
    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        title,
        summary,
        content,
        category,
        slug: slugify(title),
        image: imagePath
      }
    });

    return NextResponse.json(updatedNews, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar noticia:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Buscamos la noticia en la base de datos
    const newsToDelete = await prisma.news.findUnique({
      where: { id }
    });

    if (!newsToDelete) {
      return NextResponse.json({ message: 'Noticia no encontrada' }, { status: 404 });
    }

    // Si hay una imagen, intentamos eliminarla
    if (newsToDelete.image?.startsWith('/uploads/')) {
      try {
        const imagePath = path.join(process.cwd(), 'public', newsToDelete.image);
        await unlinkAsync(imagePath);
      } catch (err) {
        console.error('Error al eliminar imagen:', err);
      }
    }

    // Eliminar de la base de datos
    await prisma.news.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Noticia eliminada correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar noticia:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
