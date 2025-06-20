import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/authMiddleware';
import prisma from '@/lib/prisma';
import { hasPermission } from '@/lib/roleUtils';

export const GET = withAuth(async (req: NextRequest) => {
  try {
    // Obtener token del usuario desde el servidor
    const user = await import('@/lib/authServerUtils').then(module => module.validateToken());
    
    // Verificar permisos
    const hasViewPermission = await import('@/lib/authServerUtils').then(module => 
      module.checkUserPermission('documents', 'view'));
      
    if (!hasViewPermission) {
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

export const POST = withAuth(async (req: NextRequest) => {
  try {
    // Obtener token del usuario desde el servidor
    const user = await import('@/lib/authServerUtils').then(module => module.validateToken());
    
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    // Verificar permisos
    const hasCreatePermission = await import('@/lib/authServerUtils').then(module => 
      module.checkUserPermission('documents', 'create'));
      
    if (!hasCreatePermission) {
      return NextResponse.json({ error: 'No tiene permisos para crear documentos' }, { status: 403 });
    }

    // En un caso real aquí procesaríamos el archivo subido a través de formData
    // y lo guardaríamos en algún servicio de almacenamiento como AWS S3
      // Por ahora, solo simulamos la creación de un registro
    const data = await req.json();
    
    // Importar la función createDocument que maneja automáticamente documentRef
    const { createDocument } = await import('@/lib/documentUtils');
    
    // Crear el documento usando la función que genera documentRef automáticamente
    const document = await createDocument({
      title: data.title,
      description: data.description || '',
      fileName: data.fileName,
      fileUrl: data.fileUrl,
      fileSize: data.fileSize,
      mimeType: data.mimeType,
      uploadedBy: user?.id || '',
      category: data.category || '',
      tags: data.tags || ''
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Error al crear documento:', error);
    return NextResponse.json({ error: 'Error al crear documento' }, { status: 500 });
  }
});
