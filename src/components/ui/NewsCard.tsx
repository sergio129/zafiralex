'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Función para obtener la URL de la imagen basada en el tipo de almacenamiento
function getImageUrl(news: NewsItem): string {
  // Si tenemos un ID y es una noticia con imagen almacenada en la base de datos
  if (news.id && (news.imageData !== undefined || news.mimeType !== undefined)) {
    return `/api/news/${news.id}/image`;
  }
  
  // Si es una noticia con imagen legacy (ruta de archivo)
  if (news.image) {
    return news.image.startsWith('/') ? news.image : `/uploads/news/${news.image}`;
  }
  
  // Si no hay imagen, usar un placeholder
  return '/placeholder-image.jpg';
}

export interface NewsItem {
  id: number | string;
  title: string;
  slug: string;
  date: string;
  excerpt?: string;
  summary?: string; // Para compatibilidad con la API
  content: string; // Contenido completo de la noticia
  image?: string; // Campo legacy - ruta a la imagen
  imageData?: Uint8Array | null; // Datos binarios de la imagen (no se usa en frontend)
  imageName?: string | null; // Nombre original del archivo
  mimeType?: string | null; // Tipo MIME de la imagen
  imageAlt?: string; // Texto alternativo para la imagen
  category: string; // Categoría de la noticia
  featured?: boolean; // Si es una noticia destacada
}

interface NewsCardProps {
  readonly news: NewsItem;
  readonly index?: number; // Para animaciones escalonadas
  readonly featured?: boolean; // Si debería mostrarse como destacada
}

export default function NewsCard({ news, index = 0, featured = false }: NewsCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`bg-white rounded-lg shadow-md overflow-hidden ${
        featured ? 'lg:col-span-2 lg:grid lg:grid-cols-2 lg:gap-4' : ''
      }`}
    >      {/* Imagen */}
      <div className={`relative ${featured ? 'h-64 lg:h-full' : 'h-48'}`}>
        <Image 
          src={getImageUrl(news)}
          alt={news.imageAlt ?? news.title}
          fill
          sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "100vw"}
          className="object-cover"
          onError={(e) => {
            // Si la imagen falla, usar un placeholder
            const target = e.target as HTMLImageElement;
            target.src = "https://via.placeholder.com/800x600?text=Zafira+Lex";
            target.onerror = null; // Evitar que se repita el error
          }}
        />
        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 m-2 rounded">
          {news.category}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <span className="text-sm text-gray-500">{news.date}</span>
        <h3 className="text-xl font-semibold mt-2 mb-3 text-gray-900">
          {news.title}
        </h3>
        <p className="text-gray-600 line-clamp-3 mb-4">
          {news.excerpt}
        </p>
        <Link 
          href={`/noticias/${news.slug}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          Leer más
          <svg 
            className="ml-1 w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            >
            </path>
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}
