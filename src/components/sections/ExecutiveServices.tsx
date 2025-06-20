'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ExecutiveServices() {
  // Los servicios destacados de Procesos Ejecutivos que se ven en la primera imagen
  const ejecutivoServicios = [
    {
      id: 1,
      icon: (
        <svg className="h-8 w-8 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Ejecución de títulos valores y documentos que presten mérito ejecutivo",
      description: "Gestionamos procesos de cobro basados en documentos con fuerza ejecutiva como pagarés, cheques o facturas."
    },
    {
      id: 2,
      icon: (
        <svg className="h-8 w-8 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Gestión judicial y extrajudicial de cobros",
      description: "Implementamos estrategias eficaces para la recuperación de obligaciones a través de vías legales y alternativas."
    },
    {
      id: 3,
      icon: (
        <svg className="h-8 w-8 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Diseño de estrategias para la recuperación de cartera",
      description: "Creamos planes personalizados que maximizan las posibilidades de recuperación mientras protegen su relación comercial."
    },
    {
      id: 4,
      icon: (
        <svg className="h-8 w-8 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Prevención del deterioro patrimonial mediante análisis legal de cartera",
      description: "Evaluamos jurídicamente su cartera para identificar riesgos y oportunidades de mejora en sus procesos de cobro."
    }
  ];
  return (
    <section className="pt-28 pb-20 bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
      {/* Decorative elements - Mejorados para mayor impacto visual */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-blue-800"></div>
      <div className="absolute top-0 right-0 h-96 w-96 bg-blue-100 rounded-full -mr-32 -mt-32 opacity-50"></div>
      <div className="absolute bottom-0 left-0 h-96 w-96 bg-blue-100 rounded-full -ml-48 -mb-48 opacity-50"></div>
      <div className="absolute top-40 left-1/4 h-20 w-20 bg-blue-200 rounded-full blur-xl opacity-60"></div>
      <div className="absolute bottom-40 right-1/4 h-32 w-32 bg-blue-200 rounded-full blur-xl opacity-60"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-block">
            <div className="bg-blue-100 text-blue-800 text-sm font-semibold py-1.5 px-6 rounded-full mb-4 shadow-sm">
              Servicios Destacados
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-5 border-b-4 border-blue-600 inline-block pb-3">
              Procesos Ejecutivos
            </h2>
          </div>
          <p className="text-2xl text-gray-700 max-w-3xl mx-auto mt-6 leading-relaxed">
            Somos especialistas en recuperación de cartera y ejecución efectiva de obligaciones contractuales
          </p>
        </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {ejecutivoServicios.map((servicio, index) => (
            <motion.div
              key={servicio.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:translate-y-[-8px] border-l-4 border-blue-600 group relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              {/* Elemento decorativo */}
              <div className="absolute -right-12 -bottom-12 h-40 w-40 bg-blue-50 rounded-full opacity-50 group-hover:bg-blue-100 transition-all duration-300"></div>
              
              <div className="flex items-start relative z-10">
                <div className="mr-5 p-6 bg-blue-100 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 flex-shrink-0 shadow-md">
                  {servicio.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors duration-300">{servicio.title}</h3>
                  <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 text-lg">{servicio.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-16"
        >
          <Link
            href="/servicios"
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-10 py-5 rounded-lg font-bold text-xl hover:from-blue-700 hover:to-blue-900 transition-all inline-block shadow-xl hover:shadow-2xl transform hover:scale-105 relative overflow-hidden group"
          >
            <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            Ver Todos Nuestros Servicios Jurídicos
            <svg className="w-6 h-6 inline-block ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
