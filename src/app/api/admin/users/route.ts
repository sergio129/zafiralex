import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/authMiddleware';
import { checkUserPermission } from '@/lib/authServerUtils';

// GET: Obtener todos los usuarios
async function handler(req: NextRequest) {
  try {
    // Verificar permisos del usuario
    const hasPermission = await checkUserPermission('users', 'view');
    
    if (!hasPermission) {
      return NextResponse.json(
        { message: 'No tienes permisos para ver usuarios' },
        { status: 403 }
      );
    }
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );  }
}

// Solo administradores pueden gestionar usuarios
export const GET = withAuth(handler);
