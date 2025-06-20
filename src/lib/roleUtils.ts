// Definición de roles y sus permisos

// Tipos de roles disponibles
export type Role = 'admin' | 'editor' | 'secretaria' | 'abogado';

// Estructura de permisos para cada módulo
interface ModulePermissions {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

// Interfaz para los permisos de todo el sistema
export interface SystemPermissions {
  dashboard: { view: boolean };
  news: ModulePermissions;
  testimonials: ModulePermissions;
  messages: ModulePermissions;
  users: ModulePermissions;
  documents: ModulePermissions;
}

// Definición de permisos por rol
const rolePermissions: Record<Role, SystemPermissions> = {
  admin: {
    dashboard: { view: true },
    news: { view: true, create: true, edit: true, delete: true },
    testimonials: { view: true, create: true, edit: true, delete: true },
    messages: { view: true, create: true, edit: true, delete: true },
    users: { view: true, create: true, edit: true, delete: true },
    documents: { view: true, create: true, edit: true, delete: true }
  },
  editor: {
    dashboard: { view: true },
    news: { view: true, create: true, edit: true, delete: true },
    testimonials: { view: true, create: true, edit: true, delete: true },
    messages: { view: false, create: false, edit: false, delete: false },
    users: { view: false, create: false, edit: false, delete: false },
    documents: { view: false, create: false, edit: false, delete: false }
  },
  secretaria: {
    dashboard: { view: true },
    news: { view: false, create: false, edit: false, delete: false },
    testimonials: { view: false, create: false, edit: false, delete: false },
    messages: { view: true, create: true, edit: true, delete: true },
    users: { view: false, create: false, edit: false, delete: false },
    documents: { view: false, create: false, edit: false, delete: false }
  },
  abogado: {
    dashboard: { view: true },
    news: { view: true, create: false, edit: false, delete: false },
    testimonials: { view: true, create: false, edit: false, delete: false },
    messages: { view: true, create: false, edit: false, delete: false },
    users: { view: false, create: false, edit: false, delete: false },
    documents: { view: true, create: true, edit: true, delete: true }
  }
};

// Funciones de utilidad para verificar permisos
export const hasPermission = (role: Role | string, module: keyof SystemPermissions, action: keyof ModulePermissions | 'view'): boolean => {
  // Si no es un rol válido, no tiene permiso
  if (!Object.keys(rolePermissions).includes(role)) {
    return false;
  }

  const typedRole = role as Role;
  
  // Si el módulo es dashboard, solo verificamos 'view'
  if (module === 'dashboard') {
    return action === 'view' ? rolePermissions[typedRole].dashboard.view : false;
  }
  
  // Para otros módulos, verificamos la acción específica
  return rolePermissions[typedRole][module][action as keyof ModulePermissions];
};

// Función para obtener todos los permisos de un rol
export const getRolePermissions = (role: Role | string): SystemPermissions | null => {
  if (!Object.keys(rolePermissions).includes(role)) {
    return null;
  }
  return rolePermissions[role as Role];
};

// Lista de roles disponibles para mostrar en UI
export const availableRoles: Array<{value: Role, label: string}> = [
  { value: 'admin', label: 'Administrador' },
  { value: 'editor', label: 'Editor' },
  { value: 'secretaria', label: 'Secretaria' },
  { value: 'abogado', label: 'Abogado' }
];
