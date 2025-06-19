import { PrismaClient } from '@prisma/client';

// PrismaClient es adjunto al objeto global en desarrollo para evitar
// agotar el límite de conexiones a la DB durante hot-reloading
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Exportamos una instancia única de PrismaClient
export const prisma =
  global.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// Si no estamos en producción, guardamos la instancia en la variable global
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
