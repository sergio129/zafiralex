'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { hasPermission } from '@/lib/roleUtils';
import { AdminUser } from '@/types/admin';

interface DashboardStats {
  newsCount: number;
  testimonialsCount: number;
  messagesCount: number;
  pendingMessagesCount: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  useEffect(() => {
    const fetchUserAndStats = async () => {
      try {
        // Obtener información del usuario
        const userResponse = await fetch('/api/admin/auth/me');
        if (!userResponse.ok) {
          throw new Error('Error al cargar información del usuario');
        }
        const userData = await userResponse.json();
        setUser(userData);
        
        // Obtener estadísticas
        const statsResponse = await fetch('/api/admin/stats');
        if (!statsResponse.ok) {
          throw new Error('Error al cargar las estadísticas');
        }
        const statsData = await statsResponse.json();
        setStats(statsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="spinner">Cargando...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Panel de Administración</h1>
      
      {/* Bienvenida personalizada */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Bienvenido/a <span className="font-semibold">{user?.name || 'Usuario'}</span>. 
              Su rol es: <span className="font-semibold">
                {user?.role === 'admin' && 'Administrador'}
                {user?.role === 'editor' && 'Editor'}
                {user?.role === 'secretaria' && 'Secretaria'}
                {user?.role === 'abogado' && 'Abogado'}
              </span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Noticias Card - Solo para admin y editor */}
        {user && hasPermission(user.role, 'news', 'view') && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Noticias</h2>
              <span className="text-2xl font-bold text-indigo-600">{stats?.newsCount ?? 0}</span>
            </div>
            <p className="text-gray-600 mt-2">Gestione las noticias de su sitio web</p>
            <div className="mt-4">
              <Link href="/admin/news" className="text-indigo-600 hover:text-indigo-800">
                Ver todas las noticias
              </Link>
              {hasPermission(user.role, 'news', 'create') && (
                <Link href="/admin/news/new" className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                  Añadir nueva
                </Link>
              )}
            </div>
          </div>
        )}
        
        {/* Testimonios Card - Solo para admin y editor */}
        {user && hasPermission(user.role, 'testimonials', 'view') && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Testimonios</h2>
              <span className="text-2xl font-bold text-indigo-600">{stats?.testimonialsCount ?? 0}</span>
            </div>
            <p className="text-gray-600 mt-2">Gestione los testimonios de clientes</p>
            <div className="mt-4">
              <Link href="/admin/testimonios" className="text-indigo-600 hover:text-indigo-800">
                Ver todos los testimonios
              </Link>
              {hasPermission(user.role, 'testimonials', 'create') && (
                <Link href="/admin/testimonios/nuevo" className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                  Añadir nuevo
                </Link>
              )}
            </div>
          </div>
        )}
        
        {/* Mensajes Card - Solo para admin y secretaria */}
        {user && hasPermission(user.role, 'messages', 'view') && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Mensajes</h2>
              <span className="text-2xl font-bold text-green-600">              
                {stats?.messagesCount ?? 0}
                {stats && stats.pendingMessagesCount > 0 && (
                  <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded-full">
                    {stats.pendingMessagesCount} pendientes
                  </span>
                )}
              </span>
            </div>
            <p className="text-gray-600 mt-2">Gestione los mensajes del formulario de contacto</p>
            <div className="mt-4">
              <Link href="/admin/mensajes" className="text-green-600 hover:text-green-800">
                Ver todos los mensajes
              </Link>
              <Link href="/admin/mensajes" className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Gestionar
              </Link>
            </div>
          </div>
        )}
        
        {/* Documentos Card - Solo para admin y abogado */}
        {user && hasPermission(user.role, 'documents', 'view') && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Documentos</h2>
              <span className="text-2xl font-bold text-purple-600">Gestión</span>
            </div>
            <p className="text-gray-600 mt-2">Gestione los documentos legales</p>
            <div className="mt-4">
              <Link href="/admin/documentos" className="text-purple-600 hover:text-purple-800">
                Ver documentos
              </Link>
              {hasPermission(user.role, 'documents', 'create') && (
                <Link href="/admin/documentos/nuevo" className="ml-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                  Subir nuevo
                </Link>
              )}
            </div>
          </div>
        )}
        
        {/* Usuarios Card - Solo para admin */}
        {user && hasPermission(user.role, 'users', 'view') && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Usuarios</h2>
              <span className="text-2xl font-bold text-blue-600">{user?.role === 'admin' ? 'Admin' : 'Lectura'}</span>
            </div>
            <p className="text-gray-600 mt-2">Gestione los usuarios del sistema</p>
            <div className="mt-4">
              <Link href="/admin/usuarios" className="text-blue-600 hover:text-blue-800">
                Ver todos los usuarios
              </Link>
              {hasPermission(user.role, 'users', 'edit') && (
                <Link href="/admin/usuarios" className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Gestionar
                </Link>
              )}
            </div>
          </div>
        )}
      </div>      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Accesos rápidos</h2>
        <div className="flex flex-wrap gap-4">
          {/* Enlaces según permisos */}
          {user && hasPermission(user.role, 'news', 'create') && (
            <Link href="/admin/news/new" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-medium">
              Nueva noticia
            </Link>
          )}
          
          {user && hasPermission(user.role, 'testimonials', 'create') && (
            <Link href="/admin/testimonios/nuevo" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-medium">
              Nuevo testimonio
            </Link>
          )}
          
          {user && hasPermission(user.role, 'messages', 'view') && (
            <Link href="/admin/mensajes" className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-medium">
              Ver mensajes
            </Link>
          )}
          
          {user && hasPermission(user.role, 'documents', 'create') && (
            <Link href="/admin/documentos/nuevo" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-medium">
              Subir documento
            </Link>
          )}
          
          {user && hasPermission(user.role, 'users', 'view') && (
            <Link href="/admin/usuarios" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium">
              Gestionar usuarios
            </Link>
          )}
          
          {/* Enlace al sitio web - visible para todos */}
          <Link href="/" target="_blank" className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white font-medium">
            Ver sitio web
          </Link>
        </div>
      </div>
    </div>
  );
}
