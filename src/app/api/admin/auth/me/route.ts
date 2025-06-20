import { NextRequest, NextResponse } from 'next/server';
import { validateAuthToken } from '@/lib/authMiddleware';

export async function GET(req: NextRequest) {
  try {
    const userData = await validateAuthToken(req);
    
    if (!userData) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    return NextResponse.json({ error: 'Error al obtener datos del usuario' }, { status: 500 });
  }
}
