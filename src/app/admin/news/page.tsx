'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NewsItem } from '@/components/ui/NewsCard';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteNewsId, setDeleteNewsId] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/admin/news');
        if (!response.ok) {
          throw new Error('Error al cargar las noticias');
        }
        const data = await response.json();
        setNews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleDeleteClick = (id: string | number) => {
    setDeleteNewsId(id.toString());
    setIsConfirmDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteNewsId) return;
    
    try {
      const response = await fetch(`/api/admin/news/${deleteNewsId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la noticia');
      }

      // Actualizar lista de noticias
      setNews(news.filter(item => item.id !== deleteNewsId));
      setIsConfirmDialogOpen(false);
      setDeleteNewsId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la noticia');
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmDialogOpen(false);
    setDeleteNewsId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Noticias</h1>
        <Link 
          href="/admin/news/new" 
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Añadir Nueva Noticia
        </Link>
      </div>

      {news.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <p className="text-center text-yellow-700">
            No hay noticias disponibles. Añada una nueva noticia para comenzar.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {news.map((item) => (
                <tr key={item.id}>                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{item.excerpt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/admin/news/edit/${item.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        title="Confirmar eliminación"
        message="¿Está seguro de que desea eliminar esta noticia?"
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
