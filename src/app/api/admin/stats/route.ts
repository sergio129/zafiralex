import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/authMiddleware';
import { prisma } from '@/lib/prisma';

export const GET = withAuth(async (_req: NextRequest) => {  try {
    // Consultar datos directamente desde la base de datos usando Prisma
    const newsCount = await prisma.news.count();
    const testimonialsCount = await prisma.testimonial.count();
    const messagesCount = await prisma.contactMessage.count();
    const pendingMessagesCount = await prisma.contactMessage.count({
      where: { status: 'pending' }
    });

    // Construir estadísticas con los datos reales de la base de datos
    const stats = {
      newsCount,
      testimonialsCount,
      messagesCount,
      pendingMessagesCount
    };
    
    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
});
