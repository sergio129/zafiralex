import { NextResponse } from 'next/server';
import { slugify } from '@/lib/fileUtils';
import { prisma } from '@/lib/prisma';

// GET: Obtener una noticia por ID
export async function GET(request: Request) {
  try {
    // Extraer el ID de la URL en lugar de los parámetros
    const id = request.url.split('/').pop() as string;

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

export async function PUT(request: Request) {
  try {
    // Extraer el ID de la URL en lugar de los parámetros
    const id = request.url.split('/').pop() as string;
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

    // Datos para actualizar
    const updateData: any = {
      title,
      summary,
      content,
      category,
      slug: slugify(title),
    };

    // Procesar la imagen si se proporciona una nueva
    if (imageFile && imageFile instanceof File) {
      // Obtener los datos binarios de la imagen
      const arrayBuffer = await imageFile.arrayBuffer();
      const imageData = Buffer.from(arrayBuffer);
      
      // Actualizar los campos de la imagen en la base de datos
      updateData.imageData = imageData;
      updateData.imageName = imageFile.name;
      updateData.mimeType = imageFile.type;
    }

    // Actualizar en la base de datos
    const updatedNews = await prisma.news.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(updatedNews, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar noticia:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Extraer el ID de la URL en lugar de los parámetros
    const id = request.url.split('/').pop() as string;
    
    // Buscamos la noticia en la base de datos
    const newsToDelete = await prisma.news.findUnique({
      where: { id }
    });

    if (!newsToDelete) {
      return NextResponse.json({ message: 'Noticia no encontrada' }, { status: 404 });
    }

    // Eliminar de la base de datos (la imagen se eliminará automáticamente)
    await prisma.news.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Noticia eliminada correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar noticia:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
