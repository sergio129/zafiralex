// Script para verificar el hash de la contraseña
import { hashPassword } from '../src/lib/fileUtils.js';

// Contraseña de prueba
const password = 'admin123';
const hashedPassword = hashPassword(password);

console.log(`Contraseña original: ${password}`);
console.log(`Contraseña hasheada usando fileUtils.hashPassword: ${hashedPassword}`);

// Hash directo con crypto para comparar
import crypto from 'crypto';
const directHash = crypto
  .createHash('sha256')
  .update(password)
  .digest('hex');

console.log(`Hash directo usando crypto: ${directHash}`);
