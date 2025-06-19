'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Función para verificar si la noticia tiene imagen
function hasImage(article: NewsItem): boolean {
  return !!(article.image || article.imageData || (article.id && article.mimeType));
}

// Función para obtener la URL de la imagen basada en el tipo de almacenamiento
function getImageUrl(article: NewsItem): string {
  // Si tenemos un ID y es una noticia con imagen almacenada en la base de datos
  if (article.id && (article.imageData !== undefined || article.mimeType !== undefined)) {
    return `/api/news/${article.id}/image`;
  }
  
  // Si es una noticia con imagen legacy (ruta de archivo)
  if (article.image) {
    return article.image.startsWith('/') ? article.image : `/uploads/news/${article.image}`;
  }
  
  // Si no hay imagen, usar un placeholder
  return '/placeholder-image.jpg';
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  image?: string;
  imageData?: Uint8Array | null;
  imageName?: string | null;
  mimeType?: string | null;
  category: string;
  slug: string;
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news')
        if (!response.ok) {
          throw new Error('Error al cargar las noticias')
        }
        const data = await response.json()
        setNews(data)
      } catch (err) {
        console.error('Error al cargar noticias:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block border-b-4 border-blue-600 mb-4">
            <h2 className="text-4xl font-bold text-gray-900">
              Últimas Noticias
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Mantente informado sobre las últimas novedades, logros y desarrollos 
            de nuestra empresa.
          </p>
        </div>        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Mostrar placeholders si está cargando
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : news.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500">No hay noticias disponibles actualmente.</p>
            </div>
          ) : (
            news.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >                {/* Image */}
                {hasImage(article) ? (
                  <div className="h-48 relative">
                    <Image
                      src={getImageUrl(article)}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      onError={(e) => {
                        // Mostrar un placeholder si la imagen falla
                        e.currentTarget.src = '/placeholder-image.jpg';
                      }}
                    />
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-2 py-1">
                      {article.category}
                    </div>
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
                    <div className="text-white text-center">
                      <svg className="h-16 w-16 mx-auto mb-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                      </svg>
                      <p className="text-sm opacity-90">{article.category}</p>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {article.category}
                    </span>
                    <span className="text-gray-500 text-sm ml-auto">
                      {new Date(article.date).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.summary}
                  </p>
                  
                  <Link href={`/noticias/${article.slug}`} className="text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center group">
                    Leer más
                    <svg className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 5l7 7-7 7"/>
                    </svg>
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>        {/* CTA */}
        <div className="text-center mt-16">
          <Link href="/noticias" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg inline-block">
            Ver Todas las Noticias
          </Link>
        </div>
      </div>
    </section>
  )
}
