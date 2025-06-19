'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Importamos los tipos necesarios
interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  category: string;
  slug: string;
}

// Función para obtener la URL de la imagen basada en el tipo de almacenamiento
function getImageUrl(newsId: string): string {
  return `/api/news/${newsId}/image`;
}

export default function NoticiaDetailPage() {
  const { slug } = useParams();
  const [noticia, setNoticia] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchNoticia = async () => {
      if (!slug) {
        setError('No se encontró la noticia');
        setLoading(false);
        return;
      }

      try {
        // Usar el endpoint específico para obtener noticias por slug
        const response = await fetch(`/api/news/by-slug?slug=${encodeURIComponent(slug as string)}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('No se encontró la noticia');
            setLoading(false);
            return;
          }
          throw new Error('Error al cargar la noticia');
        }
        
        const noticiaEncontrada = await response.json();
        setNoticia(noticiaEncontrada);
      } catch (err) {
        console.error('Error al cargar noticia:', err);
        setError('Error al cargar la noticia. Por favor, inténtelo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchNoticia();
  }, [slug]);

  // Función para formatear la fecha
  const formatearFecha = (fechaString: string) => {
    try {
      const fecha = new Date(fechaString);
      return format(fecha, "d 'de' MMMM 'de' yyyy", { locale: es });
    } catch {
      return fechaString;
    }
  };

  if (loading) {
    return (
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-10"></div>
            <div className="h-96 bg-gray-200 rounded mb-8"></div>
            <div className="h-4 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !noticia) {
    return (
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">No se encontró la noticia</h1>
          <p className="text-lg text-gray-600 mb-8">{error || 'La noticia que buscas no existe o ha sido eliminada.'}</p>
          <Link 
            href="/noticias" 
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
          >
            Volver a Noticias
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {noticia.title}
          </h1>
          
          <div className="flex items-center text-gray-600 mb-6">
            <span className="mr-4">{formatearFecha(noticia.date)}</span>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {noticia.category}
            </span>
          </div>
          
          <div className="mb-8 relative h-96 w-full">
            <Image
              src={getImageUrl(noticia.id)}
              alt={noticia.title}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover rounded-lg"
              onError={(e) => {
                // Si la imagen falla, usar un placeholder
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-image.jpg";
                target.onerror = null; // Evitar que se repita el error
              }}
            />
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 font-medium mb-6">{noticia.summary}</p>
            
            <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: noticia.content }} />
          </div>
        </div>
        
        <div className="mt-12">
          <Link 
            href="/noticias" 
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg 
              className="mr-1 w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M15 19l-7-7 7-7"
              >
              </path>
            </svg>
            Volver a todas las noticias
          </Link>
        </div>
      </div>
    </main>
  );
}
