import { PrismaClient } from '@prisma/client';

// Declaración para el objeto global en Node.js
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Usar una única instancia de PrismaClient para reducir conexiones
export const prisma = global.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Si no estamos en producción, asignar la instancia al objeto global
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
