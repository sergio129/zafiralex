import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createDocument, findDocuments } from '@/lib/documentUtils';
import { validateToken, checkUserPermission } from '@/lib/authServerUtils';

export async function GET(request: NextRequest) {
  try {
    // Obtener parámetros de búsqueda de la URL
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || undefined;
    const tags = searchParams.get('tags') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 10;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset') as string) : 0;

    // Buscar documentos según los criterios
    const result = await findDocuments({
      category,
      tags,
      search,
      limit,
      offset
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    return NextResponse.json(
      { error: 'Error al obtener los documentos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const user = await validateToken();
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    // Verificar permisos (solo admin y abogado pueden crear documentos)
    const hasPermission = await checkUserPermission('documents', 'create');
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'No tienes permisos para crear documentos' },
        { status: 403 }
      );
    }

    const userId = user.id;
    const data = await request.json();

    // Validar datos requeridos
    if (!data.title || !data.fileName || !data.fileUrl || !data.fileSize || !data.mimeType) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Crear el documento con referencia automática
    const document = await createDocument({
      title: data.title,
      description: data.description || null,
      fileName: data.fileName,
      fileUrl: data.fileUrl,
      fileSize: data.fileSize,
      mimeType: data.mimeType,
      uploadedBy: userId,
      category: data.category || null,
      tags: data.tags || null
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Error al crear documento:', error);
    return NextResponse.json(
      { error: 'Error al crear el documento' },
      { status: 500 }
    );
  }
}
