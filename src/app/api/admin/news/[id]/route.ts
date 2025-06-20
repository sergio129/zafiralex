import { NextResponse } from 'next/server';
import { slugify } from '@/lib/fileUtils';
import { prisma } from '@/lib/prisma';
import { validateToken, checkUserPermission } from '@/lib/authServerUtils';

// Utilizamos una definición de tipos más simple para evitar problemas de compilación
// y usamos la misma implementación que funciona en testimonios

// GET: Obtener una noticia por ID
export async function GET(request: Request) {
  // Verificar autenticación
  const user = await validateToken();
  if (!user) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }
  
  // Verificar permisos
  const hasPermission = await checkUserPermission('news', 'view');
  if (!hasPermission) {
    return NextResponse.json(
      { error: 'No tienes permisos para ver noticias' },
      { status: 403 }
    );
  }
  try {
    // Extraer el ID de la URL en lugar de los parámetros
    const id = request.url.split('/').pop() as string;

    const newsItem = await prisma.news.findUnique({
      where: { id }
    });

    if (!newsItem) {
      return NextResponse.json({ message: 'Noticia no encontrada' }, { status: 404 });
    }

    // Para evitar devolver el buffer de la imagen en JSON y sobrecargar la respuesta,
    // generamos una url para acceder a la imagen en su lugar cuando se necesite
    if (newsItem.imageData) {
      const newsWithoutImageData = {
        ...newsItem,
        imageData: undefined, // No enviamos los datos binarios en la API
        hasImage: true // Indicamos que tiene imagen
      };
      
      return NextResponse.json(newsWithoutImageData, { status: 200 });
    }

    return NextResponse.json(newsItem, { status: 200 });
  } catch (error) {
    console.error('Error al obtener noticia:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Verificar autenticación
    const user = await validateToken();
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    // Verificar permisos
    const hasPermission = await checkUserPermission('news', 'edit');
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'No tienes permisos para editar noticias' },
        { status: 403 }
      );
    }
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
    // Verificar autenticación
    const user = await validateToken();
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    // Verificar permisos
    const hasPermission = await checkUserPermission('news', 'delete');
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'No tienes permisos para eliminar noticias' },
        { status: 403 }
      );
    }
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
