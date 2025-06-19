// Script para crear o actualizar el usuario administrador
const { PrismaClient } = require('../src/generated/prisma/index.js');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Crear o actualizar usuario administrador
async function setupAdminUser() {
  try {
    console.log('Configurando usuario administrador...');
    
    const email = process.env.ADMIN_EMAIL || 'admin@zafira.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log(`Usando email: ${email}`);
    console.log(`Contraseña hasheada con bcrypt generada correctamente`);
    
    // Buscar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      // Actualizar contraseña
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
      });
      console.log('Usuario administrador actualizado exitosamente con nuevo hash bcrypt');
    } else {
      // Crear nuevo usuario
      await prisma.user.create({
        data: {
          email,
          name: 'Administrador',
          password: hashedPassword,
          role: 'admin',
        }
      });
      console.log('Usuario administrador creado exitosamente');
    }
  } catch (error) {
    console.error('Error configurando usuario administrador:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar script
setupAdminUser();
