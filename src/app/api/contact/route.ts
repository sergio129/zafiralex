import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sanitizeText } from '@/lib/sanitizeUtils';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validación básica
    if (!data.name || !data.email || !data.subject || !data.message) {
      return NextResponse.json(
        { error: 'Todos los campos requeridos deben estar completos' },
        { status: 400 }
      );
    }    // Sanitizar entradas
    const sanitizedData = {
      name: sanitizeText(data.name),
      email: sanitizeText(data.email),
      phone: data.phone ? sanitizeText(data.phone) : null,
      subject: sanitizeText(data.subject),
      message: sanitizeText(data.message),
    };
    
    // Guardar en la base de datos
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: sanitizedData.name,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        subject: sanitizedData.subject,
        message: sanitizedData.message,
        status: 'pending',
      },
    });
    
    return NextResponse.json({ success: true, id: contactMessage.id });
  } catch (error) {
    console.error('Error al guardar mensaje de contacto:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}

// API para listar mensajes (protegido para administradores)
export async function GET(request: NextRequest) {
  try {
    // Esta API debería ser llamada solo por administradores
    // La autenticación se maneja en el middleware
    
    const status = request.nextUrl.searchParams.get('status');
    
    const where = status ? { status } : {};
    
    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error al obtener mensajes de contacto:', error);
    return NextResponse.json(
      { error: 'Error al obtener los mensajes' },
      { status: 500 }
    );
  }
}
