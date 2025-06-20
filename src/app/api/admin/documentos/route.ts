import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/authMiddleware';
import prisma from '@/lib/prisma';
import { hasPermission } from '@/lib/roleUtils';

export const GET = withAuth(async (req: NextRequest, user) => {
  try {
    // Verificar permisos
    if (!hasPermission(user?.role as string, 'documents', 'view')) {
      return NextResponse.json({ error: 'No tiene permisos para ver documentos' }, { status: 403 });
    }

    // Obtener todos los documentos
    const documents = await prisma.document.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    return NextResponse.json({ error: 'Error al obtener documentos' }, { status: 500 });
  }
});

export const POST = withAuth(async (req: NextRequest, user) => {
  try {
    // Verificar permisos
    if (!hasPermission(user?.role as string, 'documents', 'create')) {
      return NextResponse.json({ error: 'No tiene permisos para crear documentos' }, { status: 403 });
    }

    // En un caso real aquí procesaríamos el archivo subido a través de formData
    // y lo guardaríamos en algún servicio de almacenamiento como AWS S3
    
    // Por ahora, solo simulamos la creación de un registro
    const data = await req.json();
    
    const document = await prisma.document.create({
      data: {
        title: data.title,
        description: data.description || '',
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        uploadedBy: user?.id as string,
        category: data.category || '',
        tags: data.tags || ''
      }
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Error al crear documento:', error);
    return NextResponse.json({ error: 'Error al crear documento' }, { status: 500 });
  }
});
