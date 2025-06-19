import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Extraer el slug de los parámetros de búsqueda
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');
    
    if (!slug) {
      return NextResponse.json(
        { message: 'Se requiere el parámetro slug' },
        { status: 400 }
      );
    }
    
    // Buscar la noticia por slug
    const noticia = await prisma.news.findUnique({
      where: { slug }
    });
    
    if (!noticia) {
      return NextResponse.json(
        { message: 'Noticia no encontrada' },
        { status: 404 }
      );
    }
    
    // Para evitar devolver el buffer de la imagen en JSON y sobrecargar la respuesta
    if (noticia.imageData) {
      const noticiaWithoutImageData = {
        ...noticia,
        imageData: undefined, // No enviamos los datos binarios en la API
        hasImage: true // Indicamos que tiene imagen
      };
      
      return NextResponse.json(noticiaWithoutImageData, { status: 200 });
    }
    
    return NextResponse.json(noticia, { status: 200 });
  } catch (error) {
    console.error('Error al obtener noticia por slug:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
