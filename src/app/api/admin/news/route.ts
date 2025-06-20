import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/authMiddleware';

// Proteger la ruta para roles admin y editor
async function handler(req: NextRequest) {
  try {
    // Obtener noticias desde la base de datos
    const news = await prisma.news.findMany({
      orderBy: {
        date: 'desc'
      }
    });
    
    return NextResponse.json(news, { status: 200 });
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );  }
}

export const GET = withAuth(handler, ['admin', 'editor', 'abogado']);
