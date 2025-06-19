import { AdminUser } from '../types/admin';
import { hashPassword } from './fileUtils';
import prisma from './prisma';

// Ahora usamos Prisma para interactuar con la base de datos
export const AuthService = {
  async validateCredentials(username: string, password: string): Promise<AdminUser | null> {
    try {
      const hashedPassword = hashPassword(password);
      
      // Buscar usuario por email (usado como username) y comparar contraseña
      const user = await prisma.user.findFirst({
        where: {
          email: username,
          password: hashedPassword
        }
      });
      
      if (!user) return null;
      
      // Convertir el usuario de Prisma a nuestro tipo AdminUser
      return {
        id: user.id,
        username: user.email,
        name: user.name ?? user.email.split('@')[0],
        email: user.email,
        role: user.role
      };
    } catch (error) {
      console.error('Error validando credenciales:', error);
      return null;
    }
  },

  async getUserByUsername(username: string): Promise<AdminUser | null> {
    try {
      const user = await prisma.user.findFirst({
        where: { email: username }
      });
      
      if (!user) return null;
      
      // Convertir el usuario de Prisma a nuestro tipo AdminUser
      return {
        id: user.id,
        username: user.email,
        name: user.name ?? user.email.split('@')[0],
        email: user.email,
        role: user.role
      };
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }
  }
};
