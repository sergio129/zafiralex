import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Crear respuesta
    const response = NextResponse.json(
      { message: 'Sesión cerrada correctamente' },
      { status: 200 }
    );

    // Eliminar cookie de autenticación
    response.cookies.set({
      name: 'admin-auth-token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
