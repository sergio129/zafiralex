import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// POST: Crear un nuevo usuario
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validar datos
    if (!data.name || !data.email || !data.password) {
      return NextResponse.json(
        { message: 'Nombre, email y contraseña son obligatorios' },
        { status: 400 }
      );
    }
    
    // Comprobar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { message: 'Este email ya está registrado' },
        { status: 400 }
      );
    }
    
    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || 'admin'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
