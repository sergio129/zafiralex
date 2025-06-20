import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { validateToken, checkUserPermission } from '@/lib/authServerUtils';

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
    
    // Verificar permisos (solo admin y abogado pueden subir documentos)
    const hasPermission = await checkUserPermission('documents', 'create');
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'No tienes permisos para subir documentos' },
        { status: 403 }
      );
    }    // Extraer el archivo del FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No se ha proporcionado ningún archivo' },
        { status: 400 }
      );
    }

    // Lista de tipos MIME permitidos
    const allowedMimeTypes = [
      'application/pdf',                                                 // PDF
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
      'application/msword',                                              // DOC
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',      // XLSX
      'application/vnd.ms-excel'                                         // XLS
    ];

    // Verificar si el tipo de archivo está permitido
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Solo se aceptan documentos PDF, Word y Excel.' },
        { status: 400 }
      );
    }

    // Validar el archivo
    const maxSize = 15 * 1024 * 1024; // 15MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'El archivo excede el tamaño máximo permitido (15MB)' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Crear un nombre de archivo único para evitar colisiones
    // Incluimos la fecha y un número aleatorio
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileName = `${timestamp}${randomStr}${file.name.replace(/\s+/g, '')}`;
    
    // Guardar en el directorio de uploads
    // En producción, esto debería ser en un servicio como S3, Cloudinary, etc.
    // Para desarrollo local, usamos el directorio public/uploads/documents
    const uploadsDir = process.env.UPLOADS_DIR || join(process.cwd(), 'public', 'uploads', 'documents');
    
    // Crear directorio si no existe
    try {
      await writeFile(`${uploadsDir}/${fileName}`, buffer);
    } catch (error) {
      console.error('Error al guardar el archivo:', error);
      return NextResponse.json(
        { error: 'Error al guardar el archivo en el servidor' },
        { status: 500 }
      );
    }
    
    // Retornar la URL del archivo (relativa a la raíz pública)
    return NextResponse.json({
      fileUrl: `/uploads/documents/${fileName}`,
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size
    });
  } catch (error) {
    console.error('Error en la API de carga:', error);
    return NextResponse.json(
      { error: 'Error en el servidor al procesar la carga' },
      { status: 500 }
    );
  }
}
