'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardStats {
  newsCount: number;
  testimonialsCount: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (!response.ok) {
          throw new Error('Error al cargar las estadísticas');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Noticias Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Noticias</h2>
            <span className="text-2xl font-bold text-indigo-600">{stats?.newsCount || 0}</span>
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
            <h2 className="text-xl font-semibold">Testimonios</h2>
            <span className="text-2xl font-bold text-indigo-600">{stats?.testimonialsCount || 0}</span>
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
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Accesos rápidos</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/news/new" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded">
            Nueva noticia
          </Link>
          <Link href="/admin/testimonios/nuevo" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded">
            Nuevo testimonio
          </Link>
          <Link href="/" target="_blank" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded">
            Ver sitio web
          </Link>
        </div>
      </div>
    </div>
  );
}
