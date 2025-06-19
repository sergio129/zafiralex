// Script para generar secrets seguros para variables de entorno
const crypto = require('crypto');

// Generar un secret aleatorio de 32 bytes (256 bits) codificado en hex
function generateSecureSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Generar JWT secret
const jwtSecret = generateSecureSecret();
console.log('JWT_SECRET seguro generado:');
console.log(jwtSecret);
console.log('\n');

// Generar NextAuth secret
const nextAuthSecret = generateSecureSecret();
console.log('NEXTAUTH_SECRET seguro generado:');
console.log(nextAuthSecret);
console.log('\n');

console.log('Instrucciones:');
console.log('1. Copia estos valores en tu archivo .env');
console.log('2. Asegúrate de no compartirlos o incluirlos en el control de versiones');
console.log('3. Para entornos de producción, configura estas variables en tu plataforma de hosting (ej. Vercel)');
