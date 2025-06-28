'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

// Función para formatear la fecha
function formatearFecha(fechaString: string) {
  try {
    const fecha = new Date(fechaString);
    return format(fecha, "d 'de' MMMM 'de' yyyy", { locale: es });
  } catch {
    return fechaString;
  }
}

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
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Usamos el summary si está presente, sino excerpt, y si no hay ninguno, la primera parte del contenido
  const excerpt = news.summary || news.excerpt || news.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${
        featured ? 'lg:col-span-2 lg:grid lg:grid-cols-2 lg:gap-0' : ''
      }`}
    >
      {/* Imagen */}
      <div className={`relative ${featured ? 'h-64 lg:h-full' : 'h-56'} overflow-hidden w-full`}>
        <div className={`absolute inset-0 bg-gray-200 flex items-center justify-center ${imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
          {!imageLoaded && (
            <svg className="animate-spin h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </div>
        <Image 
          src={getImageUrl(news)}
          alt={news.imageAlt ?? news.title}
          fill
          sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "100vw"}
          className={`object-contain w-full h-full transition-all duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          priority={true}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            // Si la imagen falla, usar un placeholder
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder-image.jpg";
            target.onerror = null; // Evitar que se repita el error
            setImageLoaded(true);
          }}
        />
        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-medium px-3 py-1 m-3 rounded-full">
          {news.category}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        <span className="text-sm text-gray-500 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          {formatearFecha(news.date)}
        </span>
        
        <h3 className="text-xl font-semibold mt-3 mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
          <Link href={`/noticias/${news.slug}`} className="hover:underline">
            {news.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 line-clamp-3 mb-5">
          {excerpt}
        </p>
        
        <Link 
          href={`/noticias/${news.slug}`}
          className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
        >
          Leer más
          <svg 
            className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
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
        </Link>      </div>
    </motion.div>
  );
}
