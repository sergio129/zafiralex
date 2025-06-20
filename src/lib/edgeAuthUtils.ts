import { jwtVerify } from 'jose';

/**
 * Esta función permite verificar un token JWT en el Edge Runtime
 * usando la biblioteca jose que es compatible con Edge
 */
export async function verifyEdgeToken(token: string) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET ?? 'your-secret-key-change-in-production';
    
    // Convertir la clave secreta a Uint8Array para jose
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    
    // Verificar token con jose (compatible con Edge)
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    console.error('Error verificando token en Edge:', error);
    return null;
  }
}
