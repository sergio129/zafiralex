import { AdminUser } from '../data/admin';
import { hashPassword } from './fileUtils';

// In a real application, this would interact with a database or file system
// For demo purposes, we'll use the admin.ts file data

export const AuthService = {
  validateCredentials(username: string, password: string): AdminUser | null {
    const adminUsers = require('../data/admin').adminUsers;
    const hashedPassword = hashPassword(password);
    
    const user = adminUsers.find(
      (u: AdminUser) => u.username === username && u.passwordHash === hashedPassword
    );
    
    return user || null;
  },

  getUserByUsername(username: string): AdminUser | null {
    const adminUsers = require('../data/admin').adminUsers;
    const user = adminUsers.find((u: AdminUser) => u.username === username);
    return user || null;
  }
};
