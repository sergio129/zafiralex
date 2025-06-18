import { NextRequest, NextResponse } from 'next/server';
// Importamos jsonwebtoken usando import dinámico para evitar problemas con Next.js
import { AuthService } from '@/lib/authService';

// Usar la variable de entorno JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    // Validar credenciales
    const user = AuthService.validateCredentials(username, password);

    if (!user) {
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      );
    }    // Importar jsonwebtoken dinámicamente
    const { sign } = await import('jsonwebtoken');
    
    // Crear token JWT
    const token = sign(
      { id: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Crear respuesta
    const response = NextResponse.json(
      { 
        message: 'Autenticación exitosa',
        user: {
          username: user.username,
          name: user.name,
          role: user.role
        } 
      },
      { status: 200 }
    );

    // Establecer cookie con el token
    response.cookies.set({
      name: 'admin-auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8, // 8 horas
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Error de autenticación:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
