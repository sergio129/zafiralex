/**
 * Tipos para usuarios administradores
 */

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  passwordHash?: string; // Solo presente en autenticación local
}
