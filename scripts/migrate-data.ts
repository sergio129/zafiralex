// Usamos la importación desde @prisma/client para scripts
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Rutas a los archivos JSON
// Usando path.resolve para ir un directorio hacia arriba desde scripts/ hasta la raíz del proyecto
const PROJECT_ROOT = path.resolve(__dirname, '..');
const TESTIMONIALS_FILE = path.join(PROJECT_ROOT, 'src', 'data', 'testimonials.json');
const NEWS_FILE = path.join(PROJECT_ROOT, 'src', 'data', 'news.json');

// Función para leer archivo JSON
async function readJsonFile(filePath: string) {
  try {
    const data = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error leyendo archivo JSON ${filePath}:`, error);
    return [];
  }
}

// Migrar testimonios
async function migrateTestimonials() {
  try {
    const testimonials = await readJsonFile(TESTIMONIALS_FILE);
    console.log(`Migrando ${testimonials.length} testimonios...`);

    // Truncar tabla si ya existe data
    await prisma.testimonial.deleteMany({});

    // Insertar testimonios
    for (const testimonial of testimonials) {
      await prisma.testimonial.create({
        data: {
          id: testimonial.id,
          name: testimonial.name,
          company: testimonial.company || null,
          position: testimonial.position || null,
          content: testimonial.content,
          type: testimonial.type,
          videoUrl: testimonial.videoUrl || null,
          rating: testimonial.rating || 5,
          image: testimonial.image || null,
        }
      });
    }

    console.log('Migración de testimonios completada exitosamente');
  } catch (error) {
    console.error('Error al migrar testimonios:', error);
  }
}

// Migrar noticias
async function migrateNews() {
  try {
    const news = await readJsonFile(NEWS_FILE);
    console.log(`Migrando ${news.length} noticias...`);

    // Truncar tabla si ya existe data
    await prisma.news.deleteMany({});

    // Insertar noticias
    for (const item of news) {      await prisma.news.create({
        data: {
          id: item.id,
          title: item.title,
          summary: item.summary,
          content: item.content,
          date: new Date(item.date),
          // Los campos de imagen han cambiado a imageData, imageName y mimeType
          // Por ahora no migramos las imágenes antiguas
          category: item.category,
          slug: item.slug,
        }
      });
    }

    console.log('Migración de noticias completada exitosamente');
  } catch (error) {
    console.error('Error al migrar noticias:', error);
  }
}

// Crear usuario administrador inicial
async function createAdminUser() {
  try {
    // Verificar si ya existe un usuario admin
    const adminCount = await prisma.user.count();
    
    if (adminCount === 0) {
      await prisma.user.create({
        data: {
          email: 'admin@zafira.com',
          name: 'Administrador',
          password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // 'password'
          role: 'admin',
        }
      });
      console.log('Usuario administrador creado exitosamente');
    } else {
      console.log('Ya existe al menos un usuario administrador');
    }
  } catch (error) {
    console.error('Error al crear usuario administrador:', error);
  }
}

// Ejecutar migración
async function runMigration() {
  try {
    console.log('Iniciando migración de datos...');
    
    // Migrar testimonios
    await migrateTestimonials();
    
    // Migrar noticias
    await migrateNews();
    
    // Crear usuario administrador
    await createAdminUser();
    
    console.log('Migración completada');
  } catch (error) {
    console.error('Error durante la migración:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar script
runMigration();
