import { PrismaClient } from '../generated/prisma';

// Esta variable se usa para almacenar la instancia de PrismaClient
let prismaInstance: PrismaClient | undefined;

// En entornos no serverless, usamos global para evitar múltiples instancias
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Función para obtener la instancia de Prisma
function getPrismaInstance() {
  // Para entornos no serverless como desarrollo
  if (process.env.NODE_ENV !== 'production') {
    if (!global.prisma) {
      global.prisma = new PrismaClient({
        log: ['query', 'error', 'warn'],
      });
    }
    return global.prisma;
  }

  // Para entornos serverless como Vercel
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: ['error'],
    });
  }
  return prismaInstance;
}

// Exportamos la instancia
export const prisma = getPrismaInstance();

export default prisma;
