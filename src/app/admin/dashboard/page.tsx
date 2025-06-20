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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Noticias Card */}
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
            <Link href="/admin/news/new" className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Añadir nueva
            </Link>
          </div>
        </div>
        
        {/* Testimonios Card */}
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
            <Link href="/admin/testimonios/nuevo" className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Añadir nuevo
            </Link>
          </div>
        </div>
          {/* Mensajes Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Mensajes</h2>
            <span className="text-2xl font-bold text-green-600">              {stats?.messagesCount ?? 0}
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
        
        {/* Usuarios Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Usuarios</h2>
            <span className="text-2xl font-bold text-blue-600">Admin</span>
          </div>
          <p className="text-gray-600 mt-2">Gestione los usuarios del sistema</p>
          <div className="mt-4">
            <Link href="/admin/usuarios" className="text-blue-600 hover:text-blue-800">
              Ver todos los usuarios
            </Link>
            <button 
              onClick={() => window.location.href='/admin/usuarios'} 
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Gestionar
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">        <h2 className="text-xl font-semibold mb-4 text-gray-900">Accesos rápidos</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/news/new" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-medium">
            Nueva noticia
          </Link>
          <Link href="/admin/testimonios/nuevo" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-medium">
            Nuevo testimonio
          </Link>
          <Link href="/admin/mensajes" className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-medium">
            Ver mensajes
          </Link>
          <Link href="/admin/usuarios" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium">
            Gestionar usuarios
          </Link>
          <Link href="/" target="_blank" className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white font-medium">
            Ver sitio web
          </Link>
        </div>
      </div>
    </div>
  );
}
