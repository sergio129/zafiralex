'use client'

import { useState, useEffect } from 'react'

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: "María González",
      position: "Directora General",
      company: "TechCorp Solutions",
      testimonial: "Zafira transformó completamente nuestra operación. Su equipo profesional y sus soluciones innovadoras nos ayudaron a alcanzar nuestros objetivos de manera eficiente.",
      rating: 5
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      position: "CEO",
      company: "Innovate Plus",
      testimonial: "El servicio al cliente de Zafira es excepcional. Siempre están disponibles cuando los necesitamos y sus respuestas son rápidas y efectivas.",
      rating: 5
    },
    {
      id: 3,
      name: "Ana Martínez",
      position: "Gerente de Proyectos",
      company: "Global Enterprises",
      testimonial: "Trabajar con Zafira ha sido una experiencia increíble. Su atención al detalle y compromiso con la calidad superó todas nuestras expectativas.",
      rating: 5
    },
    {
      id: 4,
      name: "Roberto Silva",
      position: "Fundador",
      company: "StartUp Vision",
      testimonial: "Como startup, necesitábamos un socio confiable que entendiera nuestras necesidades. Zafira no solo las entendió, sino que nos ayudó a crecer de manera sostenible.",
      rating: 5
    },
    {
      id: 5,
      name: "Laura Jiménez",
      position: "Directora de Operaciones",
      company: "Future Corp",
      testimonial: "La profesionalidad y expertise de Zafira es incomparable. Han sido clave en el éxito de nuestros proyectos más importantes.",
      rating: 5
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonios" className="py-20 bg-gray-50">
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
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
              </svg>

              {/* Testimonial Text */}
              <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 italic">
                "{testimonials[currentTestimonial].testimonial}"
              </blockquote>              {/* Stars Rating */}
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, starIndex) => (
                  <svg key={`${testimonials[currentTestimonial].id}-star-${starIndex}`} className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>

              {/* Author Info */}
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {testimonials[currentTestimonial].name}
                </p>
                <p className="text-gray-600">
                  {testimonials[currentTestimonial].position} en {testimonials[currentTestimonial].company}
                </p>
              </div>
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
              </svg>
            </button>
          </div>          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((testimonial, dotIndex) => (
              <button
                key={`dot-${testimonial.id}`}
                onClick={() => setCurrentTestimonial(dotIndex)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  dotIndex === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">Clientes Satisfechos</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
            <div className="text-gray-600">Proyectos Completados</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">99%</div>
            <div className="text-gray-600">Tasa de Satisfacción</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600">Soporte Disponible</div>
          </div>
        </div>
      </div>
    </section>
  )
}
