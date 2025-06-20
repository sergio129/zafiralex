import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateAuthToken } from '@/lib/authMiddleware';
import { hasPermission } from '@/lib/roleUtils';

interface Params {
  params: {
    id: string;
  };
}

// Obtener un documento por ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    
    const document = await prisma.document.findUnique({
      where: { id }
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error al obtener documento:', error);
    return NextResponse.json(
      { error: 'Error al obtener el documento' },
      { status: 500 }
    );
  }
}

// Actualizar un documento
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    
    // Verificar autenticación
    const userData = await validateAuthToken(request);
    if (!userData) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar permisos (solo admin y abogado pueden editar documentos)
    if (!hasPermission(userData.role as string, 'documents', 'edit')) {
      return NextResponse.json(
        { error: 'No tienes permisos para editar documentos' },
        { status: 403 }
      );
    }

    // Obtener datos del request
    const data = await request.json();

    // Actualizar el documento (sin cambiar documentRef)
    const updatedDocument = await prisma.document.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        tags: data.tags
      }
    });

    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error('Error al actualizar documento:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el documento' },
      { status: 500 }
    );
  }
}

// Eliminar un documento
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    
    // Verificar autenticación
    const userData = await validateAuthToken(request);
    if (!userData) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar permisos (solo admin y abogado pueden eliminar documentos)
    if (!hasPermission(userData.role as string, 'documents', 'delete')) {
      return NextResponse.json(
        { error: 'No tienes permisos para eliminar documentos' },
        { status: 403 }
      );
    }

    // Eliminar el documento
    await prisma.document.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el documento' },
      { status: 500 }
    );
  }
}
