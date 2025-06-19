import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET: Obtener un usuario por ID
export async function GET(request: Request) {
  try {
    // Extraer el ID de la URL
    const id = request.url.split('/').pop() as string;
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT: Actualizar un usuario por ID
export async function PUT(request: Request) {
  try {
    // Extraer el ID de la URL
    const id = request.url.split('/').pop() as string;
    const data = await request.json();
    
    // Validar datos
    if (!data.name || !data.email) {
      return NextResponse.json(
        { message: 'Nombre y email son obligatorios' },
        { status: 400 }
      );
    }
    
    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!existingUser) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }
    
    // Si se cambia el email, verificar que no exista otro usuario con ese email
    if (data.email !== existingUser.email) {
      const userWithEmail = await prisma.user.findUnique({
        where: { email: data.email }
      });
      
      if (userWithEmail) {
        return NextResponse.json(
          { message: 'Este email ya está registrado' },
          { status: 400 }
        );
      }
    }
    
    // Preparar los datos para actualizar
    const updateData: any = {
      name: data.name,
      email: data.email,
      role: data.role
    };
    
    // Si se proporciona una nueva contraseña, encriptarla
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    
    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un usuario por ID
export async function DELETE(request: Request) {
  try {
    // Extraer el ID de la URL
    const id = request.url.split('/').pop() as string;
    
    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!existingUser) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }
    
    // No permitir eliminar el último administrador
    const adminCount = await prisma.user.count({
      where: {
        role: 'admin'
      }
    });
    
    if (adminCount <= 1 && existingUser.role === 'admin') {
      return NextResponse.json(
        { message: 'No se puede eliminar el último administrador' },
        { status: 400 }
      );
    }
    
    // Eliminar usuario
    await prisma.user.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
