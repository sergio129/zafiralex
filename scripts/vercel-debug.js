// Este archivo se ejecutará durante el despliegue en Vercel para verificar el entorno
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== VERCEL DEPLOYMENT DEBUG ===');

// Verificar variables de entorno
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('VERCEL:', process.env.VERCEL);

// Verificar el directorio de Prisma
const prismaClientDir = path.join(__dirname, '..', 'src', 'generated', 'prisma');
console.log('Prisma client dir exists:', fs.existsSync(prismaClientDir));

// Verificar los archivos principales generados
try {
  const files = fs.readdirSync(prismaClientDir);
  console.log('Files in Prisma client dir:', files.join(', '));
  
  // Verificar que exista el archivo index.js
  const indexPath = path.join(prismaClientDir, 'index.js');
  console.log('index.js exists:', fs.existsSync(indexPath));
  
  // Verificar que exista el archivo client.js
  const clientPath = path.join(prismaClientDir, 'client.js');
  console.log('client.js exists:', fs.existsSync(clientPath));
} catch (error) {
  console.error('Error reading prisma client directory:', error);
}

console.log('=== END DEBUG ===');
