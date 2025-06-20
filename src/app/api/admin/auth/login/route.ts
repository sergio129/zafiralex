import { NextRequest, NextResponse } from 'next/server';
// Importamos jsonwebtoken usando import dinámico para evitar problemas con Next.js
import { AuthService } from '@/lib/authService';
import { sanitizeText } from '@/lib/sanitizeUtils';

// Usar la variable de entorno JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET ?? 'your-secret-key-change-in-production';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
      // Sanitizar entradas para prevenir ataques
    const sanitizedUsername = sanitizeText(body.username ?? '');
    const password = body.password ?? ''; // No sanitizamos password para no afectar la autenticación
    
    // Validar que los datos existan
    if (!sanitizedUsername || !password) {
      return NextResponse.json({ message: 'Credenciales incompletas' }, { status: 400 });
    }
    
    // Validar credenciales
    const user = await AuthService.validateCredentials(sanitizedUsername, password);

    if (!user) {
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      );
    }// Importar jsonwebtoken dinámicamente
    const { sign } = await import('jsonwebtoken');
      // Crear token JWT
    const token = sign(
      { id: user.id, role: user.role },
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
