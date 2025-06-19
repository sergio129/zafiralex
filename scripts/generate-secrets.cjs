// Script para generar secrets seguros para variables de entorno
const crypto = require('crypto');

// Generar un secret aleatorio de 32 bytes (256 bits) codificado en hex
function generateSecureSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Generar JWT secret
const jwtSecret = generateSecureSecret();
console.log('\x1b[32m%s\x1b[0m', 'JWT_SECRET seguro generado:');
console.log('\x1b[33m%s\x1b[0m', jwtSecret);
console.log('\n');

// Generar NextAuth secret
const nextAuthSecret = generateSecureSecret();
console.log('\x1b[32m%s\x1b[0m', 'NEXTAUTH_SECRET seguro generado:');
console.log('\x1b[33m%s\x1b[0m', nextAuthSecret);
console.log('\n');

console.log('\x1b[36m%s\x1b[0m', 'Instrucciones:');
console.log('1. Copia estos valores en tu archivo .env');
console.log('2. Asegúrate de no compartirlos o incluirlos en el control de versiones');
console.log('3. Para entornos de producción, configura estas variables en tu plataforma de hosting (ej. Vercel)');
