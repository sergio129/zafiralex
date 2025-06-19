import { PrismaClient } from '../generated/prisma';

// En entornos no serverless, usamos global para evitar múltiples instancias
declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
}

// Asegúrate de que PrismaClient sea instanciado sólo una vez
// eslint-disable-next-line import/no-mutable-exports
export let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  // En producción, crea una nueva instancia cada vez (Vercel serverless)
  prisma = new PrismaClient({
    log: ['error'],
    errorFormat: 'minimal',
  });
} else {
  // En desarrollo, reutiliza la instancia para evitar múltiples conexiones
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
  }
  prisma = global.cachedPrisma;
}

export default prisma;
