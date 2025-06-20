'use client'

import { useState, useEffect } from 'react'
import YouTubeEmbed from '../ui/YouTubeEmbed'
import { Testimonial } from '@/types/testimonial'

// Función para extraer el ID de YouTube de una URL
const getVideoId = (url: string = ''): string => {
  // Verifica si ya es un ID solo
  if (url && url.length === 11 && !url.includes('/')) {
    return url;
  }
  
  if (!url) return '';
  
  // Patrones comunes de URLs de YouTube
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^/?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^/?]+)/
  ];
  
  for (const pattern of patterns) {
    const result = pattern.exec(url);
    if (result?.[1]) {
      return result[1];
    }
  }
  
  return '';
};

export default function Testimonials() {  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    // Obtener testimonios del backend
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        // Usar la API pública
        const response = await fetch('/api/testimonios')
        if (!response.ok) {
          console.error('Error al cargar los testimonios: respuesta no OK')
          return
        }
        const data = await response.json()
        setTestimonials(data)
      } catch (err) {
        console.error('Error al cargar testimonios:', err)
      }
    }
    
    fetchTestimonials()
  }, [])
  
  useEffect(() => {
    if (testimonials.length === 0) {
      return;
    }
    
    // No usar rotación automática si el testimonio actual es un video
    if (testimonials[currentTestimonial]?.type === 'video') {
      return; // No configuramos ningún intervalo para los videos
    }

    // Solo configurar la rotación automática para testimonios de tipo texto
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => {
        // Encontrar el siguiente índice que no sea un video
        let nextIndex = (prev + 1) % testimonials.length;
        
        // Si el siguiente es un video, avanzar al siguiente texto
        // Si todos son videos, deja el comportamiento original
        let count = 0;  // Prevenir bucle infinito
        while (testimonials[nextIndex]?.type === 'video' && count < testimonials.length) {
          nextIndex = (nextIndex + 1) % testimonials.length;
          count++;
        }
        
        return nextIndex;
      });
    }, 8000); // Tiempo más largo (8s) para los testimonios de texto

    return () => clearInterval(interval);
  }, [currentTestimonial, testimonials])
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block border-b-4 border-blue-600 mb-4">
            <h2 className="text-4xl font-bold text-gray-900">
              Lo Que Dicen Nuestros Clientes
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            La satisfacción de nuestros clientes es nuestra mayor recompensa. 
            Conoce sus experiencias trabajando con nosotros.
          </p>
        </div>

        {/* Main Testimonial Slider */}
        <div className="relative">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mx-auto max-w-4xl border-t-4 border-blue-600">
            <div className="text-center">
              {/* Quote Icon */}
              <svg className="h-12 w-12 text-blue-600 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>              </svg>              {/* Testimonial Content (Text o Video) */}
              {testimonials.length > 0 && (
                <>
                  {testimonials[currentTestimonial]?.type === 'text' ? (
                    <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 italic">
                      &ldquo;{testimonials[currentTestimonial].content}&rdquo;
                    </blockquote>
                  ) : (
                    <div className="mb-8">
                      <div className="relative">
                        <YouTubeEmbed 
                          videoId={getVideoId(testimonials[currentTestimonial]?.videoUrl)} 
                          title={`Testimonio de ${testimonials[currentTestimonial].name}`} 
                          className="max-w-3xl mx-auto rounded-lg shadow-lg"
                        />
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-bl-lg">
                          Testimonio en video
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}              {/* Stars Rating */}
              {testimonials.length > 0 && (
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial]?.rating || 5)].map((_, starIndex) => (
                    <svg key={`${testimonials[currentTestimonial].id}-star-${starIndex}`} className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
              )}

              {/* Author Info */}
              {testimonials.length > 0 && (
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {testimonials[currentTestimonial].name}
                  </p>
                  <p className="text-gray-600">
                    {testimonials[currentTestimonial].position && testimonials[currentTestimonial].company 
                      ? `${testimonials[currentTestimonial].position} en ${testimonials[currentTestimonial].company}`
                      : testimonials[currentTestimonial].position || testimonials[currentTestimonial].company || ''}
                  </p>
                </div>
              )}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <svg className="h-6 w-6 text-gray-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <svg className="h-6 w-6 text-gray-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 5l7 7-7 7"/>
              </svg>            </button>
          </div>          {/* Dots Indicator */}
          {testimonials.length > 0 && (
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((testimonial, dotIndex) => (
                <button
                  key={`dot-${testimonial.id}`}
                  onClick={() => setCurrentTestimonial(dotIndex)}
                  className={`flex items-center justify-center ${
                    testimonial.type === 'video' ? 'w-5 h-5' : 'w-4 h-4'
                  } transition-all duration-300 ${
                    dotIndex === currentTestimonial 
                      ? 'transform scale-110' 
                      : ''
                  }`}
                  title={testimonial.type === 'video' ? 'Testimonio en video' : 'Testimonio escrito'}
                >
                  {testimonial.type === 'video' ? (
                    <span className={`w-full h-full rounded-sm flex items-center justify-center ${
                      dotIndex === currentTestimonial ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'
                    }`}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/>
                      </svg>
                    </span>
                  ) : (
                    <span className={`w-full h-full rounded-full ${
                      dotIndex === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                    }`}></span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
           
       <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-gray-600">Clientes Satisfechos</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
            <div className="text-gray-600">Casos Exitosos</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
            </div>
            <div className="text-gray-600">Tasa de Satisfacción</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">5+</div>
            <div className="text-gray-600">Años de Experiencia</div>
          </div>
        </div>
      </div>
    </section>
  )
}
