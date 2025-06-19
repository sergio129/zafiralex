import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
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
    );
  }
}
