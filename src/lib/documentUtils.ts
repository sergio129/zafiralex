import { Document } from '@prisma/client';
import { prisma } from './prisma';

/**
 * Genera un identificador de documento único con el formato:
 * YYYYMMDD-XXXXX donde XXXXX son 5 dígitos aleatorios
 */
export function generateDocumentReference(): string {
  // Obtener la fecha actual en formato YYYYMMDD
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // Generar 5 dígitos aleatorios
  const randomDigits = Math.floor(10000 + Math.random() * 90000).toString();
  
  // Combinar fecha y dígitos aleatorios con un separador
  return `${dateStr}-${randomDigits}`;
}

/**
 * Crea un nuevo documento en la base de datos generando automáticamente
 * el campo documentRef con el formato de fecha + números aleatorios
 */
export async function createDocument(documentData: Omit<Document, 'id' | 'documentRef' | 'createdAt' | 'updatedAt'>): Promise<Document> {
  // Generar el documentRef
  let documentRef = generateDocumentReference();
  let isUnique = false;
  
  // Verificar que el documentRef sea único e intentar hasta 10 veces si hay colisiones
  for (let attempt = 0; attempt < 10 && !isUnique; attempt++) {
    // Verificar si ya existe un documento con ese documentRef
    const existingDocument = await prisma.document.findUnique({
      where: { documentRef }
    });
    
    if (!existingDocument) {
      isUnique = true;
    } else {
      // Si ya existe, generar uno nuevo
      documentRef = generateDocumentReference();
    }
  }
  
  if (!isUnique) {
    throw new Error('No se pudo generar un documentRef único después de varios intentos');
  }
  
  // Crear el documento con el documentRef generado
  return await prisma.document.create({
    data: {
      ...documentData,
      documentRef
    }
  });
}

/**
 * Busca documentos por diferentes criterios
 */
export async function findDocuments(options: {
  category?: string;
  tags?: string;
  search?: string;
  userId?: string;  // ID del usuario para filtrar documentos
  roleType?: string; // Tipo de rol para determinar filtrado
  limit?: number;
  offset?: number;
}) {
  const { category, tags, search, userId, roleType, limit = 10, offset = 0 } = options;
  
  // Construir el filtro de búsqueda
  const where: any = {};
  
  if (category) {
    where.category = category;
  }
  
  if (tags) {
    // Buscar documentos que contengan al menos uno de los tags proporcionados
    where.tags = {
      contains: tags
    };
  }
  
  if (search) {
    // Búsqueda en título y descripción
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  // Si es un abogado, solo ve sus propios documentos
  // Admin y otros roles ven todos los documentos
  if (roleType === 'abogado' && userId) {
    where.uploadedBy = userId;
  }
  
  // Realizar la búsqueda
  const documents = await prisma.document.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: offset,
    take: limit
  });
  
  // Obtener los datos de los usuarios por cada documento
  const userIds = [...new Set(documents.map(doc => doc.uploadedBy))]; // Eliminar duplicados
  
  if (userIds.length > 0) {
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds }
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });
    
    // Crear un mapa de ID de usuario a datos de usuario para acceso rápido
    const userMap = new Map();
    users.forEach(user => {
      userMap.set(user.id, user);
    });
    
    // Añadir información de usuario a cada documento
    const documentsWithUsers = documents.map(doc => ({
      ...doc,
      uploader: userMap.get(doc.uploadedBy) || null
    }));
    
    return {
      documents: documentsWithUsers,
      total: await prisma.document.count({ where }),
      limit,
      offset
    };
  }
  
  return {
    documents,
    total: await prisma.document.count({ where }),
    limit,
    offset
  };
  
  // Contar el total de documentos que coinciden con el filtro
  const total = await prisma.document.count({ where });
  
  return {
    documents,
    total,
    limit,
    offset
  };
}
