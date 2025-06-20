import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PrismaClient } from '@prisma/client';

// Esto es una aserción de tipo para poder acceder a contactMessage
// Necesario si el cliente prisma no ha sido regenerado correctamente
type PrismaClientWithContactMessage = PrismaClient & {
  contactMessage: any;
};

const prismaWithContactMessage = prisma as unknown as PrismaClientWithContactMessage;

// API para actualizar un mensaje específico (solo admin)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data = await request.json();
    
    // Validación
    if (!id) {
      return NextResponse.json(
        { error: 'ID de mensaje requerido' },
        { status: 400 }
      );
    }
      // Actualizar en la base de datos
    const updatedMessage = await prismaWithContactMessage.contactMessage.update({
      where: { id },
      data: {
        status: data.status,
        notes: data.notes,
        assignedTo: data.assignedTo,
      },
    });
    
    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error('Error al actualizar mensaje de contacto:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el mensaje' },
      { status: 500 }
    );
  }
}

// API para obtener un mensaje específico (solo admin)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // Validación
    if (!id) {
      return NextResponse.json(
        { error: 'ID de mensaje requerido' },
        { status: 400 }
      );
    }
      const message = await prismaWithContactMessage.contactMessage.findUnique({
      where: { id },
    });
    
    if (!message) {
      return NextResponse.json(
        { error: 'Mensaje no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(message);
  } catch (error) {
    console.error('Error al obtener mensaje de contacto:', error);
    return NextResponse.json(
      { error: 'Error al obtener el mensaje' },
      { status: 500 }
    );
  }
}

// API para eliminar un mensaje (solo admin)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // Validación
    if (!id) {
      return NextResponse.json(
        { error: 'ID de mensaje requerido' },
        { status: 400 }
      );
    }
      await prismaWithContactMessage.contactMessage.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar mensaje de contacto:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el mensaje' },
      { status: 500 }
    );
  }
}
