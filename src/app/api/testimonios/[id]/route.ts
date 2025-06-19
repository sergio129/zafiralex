import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Obtener el testimonio de la base de datos
    const testimonio = await prisma.testimonial.findUnique({
      where: { id }
    });
    
    if (!testimonio) {
      return NextResponse.json(
        { message: 'Testimonio no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(testimonio, { status: 200 });
  } catch (error) {
    console.error('Error al obtener testimonio:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
