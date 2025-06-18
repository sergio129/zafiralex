import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  // @ts-ignore
  { params: _params }
) {
  // Esta ruta no está implementada todavía
  return NextResponse.json({ message: 'Ruta no implementada' }, { status: 501 });
}
