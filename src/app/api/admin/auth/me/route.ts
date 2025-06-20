import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '@/lib/authServerUtils';

export async function GET(req: NextRequest) {
  try {
    const user = await validateToken();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    return NextResponse.json({ error: 'Error al obtener datos del usuario' }, { status: 500 });
  }
}
