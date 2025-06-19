import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Obtener testimonios desde la base de datos
    const testimonios = await prisma.testimonial.findMany({
      orderBy: {
        id: 'desc'
      }
    });
    
    return NextResponse.json(testimonios, { status: 200 });
  } catch (error) {
    console.error('Error al obtener testimonios:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
