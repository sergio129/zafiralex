import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { validateToken, checkUserPermission } from '@/lib/authServerUtils';

// Instanciar PrismaClient directamente para evitar problemas con la importación
const prisma = new PrismaClient();

// Obtener un documento por ID
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const user = await validateToken();
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    // Verificar permisos (solo usuarios autorizados pueden ver documentos)
    const hasPermission = await checkUserPermission('documents', 'view');
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'No tienes permisos para ver documentos' },
        { status: 403 }
      );
    }
    
    // Extraer el ID de la URL en lugar de los parámetros
    const id = request.url.split('/').pop() as string;
    
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
export async function PUT(request: NextRequest) {
  try {
    // Extraer el ID de la URL en lugar de los parámetros
    const id = request.url.split('/').pop() as string;
    
    // Verificar autenticación y permisos
    const user = await validateToken();
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar permisos (solo admin y abogado pueden editar documentos)
    const hasPermission = await checkUserPermission('documents', 'edit');
    if (!hasPermission) {
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
export async function DELETE(request: NextRequest) {
  try {
    // Extraer el ID de la URL en lugar de los parámetros
    const id = request.url.split('/').pop() as string;
    
    // Verificar autenticación y permisos
    const user = await validateToken();
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar permisos (solo admin y abogado pueden eliminar documentos)
    const hasPermission = await checkUserPermission('documents', 'delete');
    if (!hasPermission) {
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
