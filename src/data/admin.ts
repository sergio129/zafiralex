export interface AdminUser {
  username: string;
  passwordHash: string;
  name: string;
  role: 'admin' | 'editor';
}

// Using a simple hashed password for demonstration
// In a real application, use a proper password hashing library like bcrypt
// This is "admin123" hashed with a simple algorithm
export const adminUsers: AdminUser[] = [
  {
    username: "admin",
    passwordHash: "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9", // admin123
    name: "Administrador",
    role: "admin"
  },
  {
    username: "editor",
    passwordHash: "58b5444cf1b6253a4317fe12daff411a78bda0a95a0b731290adcd5c71f25c49", // editor123
    name: "Editor",
    role: "editor"
  }
];

export function validateCredentials(username: string, passwordHash: string): AdminUser | null {
  const user = adminUsers.find(u => u.username === username && u.passwordHash === passwordHash);
  return user || null;
}

export function getUserByUsername(username: string): AdminUser | null {
  const user = adminUsers.find(u => u.username === username);
  return user || null;
}
