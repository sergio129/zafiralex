import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Verificar si estamos en Vercel
const isVercel = process.env.VERCEL === '1';

// Ruta de salida del cliente generado
const generatedClientPath = path.join(__dirname, '..', 'src', 'generated', 'prisma');

try {
  // Crear la carpeta si no existe
  if (!fs.existsSync(generatedClientPath)) {
    console.log('Creating generated client directory...');
    fs.mkdirSync(generatedClientPath, { recursive: true });
  }

  // Ejecutar prisma generate
  console.log('Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('Prisma Client successfully generated!');
} catch (error) {
  console.error('Error during Prisma Client generation:', error);
  // En Vercel, queremos que el build falle si la generación falla
  if (isVercel) {
    process.exit(1);
  }
}
