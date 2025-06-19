import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Obtener la noticia de la base de datos
    const news = await prisma.news.findUnique({
      where: { id },
      select: {
        imageData: true,
        mimeType: true,
        imageName: true,
      },
    });
    
    // Verificar si existe la noticia y tiene imagen
    if (!news || !news.imageData) {
      return new NextResponse('Imagen no encontrada', { status: 404 });
    }
    
    // Crear una respuesta con los datos binarios de la imagen
    const response = new NextResponse(news.imageData);
    
    // Configurar headers para la respuesta de la imagen
    response.headers.set('Content-Type', news.mimeType || 'image/jpeg');
    response.headers.set('Content-Disposition', `inline; filename="${news.imageName || 'image.jpg'}"`);
    response.headers.set('Cache-Control', 'public, max-age=31536000'); // Cache por un año
    
    return response;
  } catch (error) {
    console.error('Error al obtener la imagen:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}
