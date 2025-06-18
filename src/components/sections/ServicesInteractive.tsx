'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ServicesInteractive() {
  // Estado para los acordeones (servicio activo)
  const [activeService, setActiveService] = useState<number | null>(null);

  // Estado para las pestañas de categorías en el Derecho Civil
  const [activeTab, setActiveTab] = useState<string>("Procesos Declarativos");

  // Datos de servicios jurídicos
  const serviciosJuridicos = [
    {
      id: 1,
      icon: (
        <svg className="h-12 w-12 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      title: "Derecho Administrativo en Colombia",
      description: "Servicios Jurídicos – Compañía Jurídica Zafira Lex",
      procedimientos: [
        "1. Nulidad por Inconstitucionalidad",
        "2. Control Inmediato de Legalidad",
        "3. Acción de Nulidad",
        "4. Nulidad y Restablecimiento del Derecho",
        "5. Nulidad Electoral",
        "6. Reparación Directa",
        "7. Controversias Contractuales",
        "8. Acción de Repetición",
        "9. Pérdida de Investidura",
        "10. Protección de Derechos e Intereses Colectivos",
        "11. Reparación de Perjuicios a un Grupo (Acción de Grupo)"
      ],
      consultorias: [
        "Procesos Coactivos",
        "Procesos Sancionatorios del Derecho Administrativo",
        "Reclamaciones Administrativas en General"
      ]
    },
    {
      id: 2,
      icon: (
        <svg className="h-12 w-12 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Servicios Jurídicos para el Magisterio Colombiano",
      description: "Régimen Especial – Compañía Jurídica Zafira Lex",
      procedimientos: [
        "1. Pensiones del Régimen Especial del Magisterio",
        "2. Reliquidación Pensional Completa",
        "3. Sustitución y Sobrevivencia",
        "4. Indemnizaciones Sustitutivas",
        "5. Seguros, Auxilios e Indemnizaciones FOMAG",
        "6. Cesantías del Magisterio",
        "7. Licencias, Incapacidades y Reembolsos",
        "8. Liquidación de Fallos Judiciales",
        "9. Sanción por Mora – Intereses Legales",
        "10. Salud y Seguridad Laboral",
        "11. Fuero Laboral y Protección Especial"
      ]
    },
    {
      id: 3,
      icon: (
        <svg className="h-12 w-12 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      title: "Derecho Civil en Colombia",
      description: "Servicios Jurídicos – Compañía Jurídica Zafira Lex",
      categorias: [
        {
          nombre: "Procesos Declarativos",
          items: [
            "Acción de pertenencia",
            "Constitución y regulación de servidumbres",
            "Entrega material de bienes por parte del tradente al adquirente",
            "Declaración judicial de bienes vacantes o mostrencos",
            "Impugnación de la filiación (paternidad o maternidad)",
            "Nulidad de matrimonio civil",
            "Disolución del vínculo matrimonial (divorcio)",
            "Procesos de expropiación judicial",
            "Deslinde y amojonamiento de predios",
            "Acción divisoria",
            "Proceso monitorio (cobro de obligaciones no contradictas)",
            "Nulidad o resolución de contratos",
            "Reclamaciones por incumplimiento contractual",
            "Responsabilidad civil contractual y extracontractual"
          ]
        },
        {
          nombre: "Procesos Liquidativos",
          items: [
            "Liquidación de la sociedad conyugal o patrimonial",
            "Partición de herencias y adjudicación de bienes sucesorales",
            "Disolución y liquidación de comunidades de bienes",
            "Distribución de indemnizaciones judiciales o extrajudiciales"
          ]
        },
        {
          nombre: "Procesos Ejecutivos",
          items: [
            "Ejecución de títulos valores y documentos que presten mérito ejecutivo",
            "Diseño de estrategias para la recuperación de cartera",
            "Gestión judicial y extrajudicial de cobros",
            "Prevención del deterioro patrimonial mediante análisis legal de cartera"
          ]
        },
        {
          nombre: "Jurisdicción Voluntaria",
          items: [
            "Procedimientos de insolvencia de persona natural no comerciante",
            "Liquidación de sociedades conyugales o patrimoniales por mutuo acuerdo",
            "Procesos de sucesión testamentaria o intestada",
            "Trámites de autorización para actos jurídicos de menores o personas con discapacidad",
            "Declaración judicial de ausencia o muerte presunta",
            "Negociación de deudas bajo el régimen de insolvencia"
          ]
        }
      ]
    }
  ];

  // Función para alternar el servicio activo
  const toggleService = (serviceId: number) => {
    if (activeService === serviceId) {
      setActiveService(null);
    } else {
      setActiveService(serviceId);
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 fade-in">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block border-b-4 border-blue-600 mb-4"
          >
            <h2 className="text-4xl font-bold text-gray-900">
              Servicios Jurídicos
            </h2>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            En Zafira Lex ofrecemos servicios jurídicos especializados en las principales 
            ramas del derecho colombiano, con un enfoque profesional y personalizado.
          </motion.p>
        </div>
        
        {/* Services Accordion */}
        <div className="space-y-6">
          {serviciosJuridicos.map((servicio) => (
            <motion.div
              key={servicio.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: servicio.id * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleService(servicio.id)}
                className={`w-full p-6 flex items-center justify-between text-left transition-colors duration-300 ${
                  activeService === servicio.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`mr-4 text-blue-600 transition-transform duration-300 ${activeService === servicio.id ? 'scale-110' : ''}`}>
                    {servicio.icon}
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold transition-colors duration-300 ${
                      activeService === servicio.id ? 'text-blue-700' : 'text-gray-900'
                    }`}>
                      {servicio.title}
                    </h3>
                    <p className="text-blue-800 font-medium">
                      {servicio.description}
                    </p>
                  </div>
                </div>
                <svg 
                  className={`h-6 w-6 text-blue-600 transform transition-transform duration-300 ${activeService === servicio.id ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Accordion Content */}
              <AnimatePresence>
                {activeService === servicio.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 border-t border-gray-100">
                      {/* Procedimientos para Derecho Administrativo y Magisterio */}
                      {servicio.procedimientos && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="mb-8"
                        >
                          <h4 className="text-lg font-semibold text-blue-800 mb-4 border-b border-gray-200 pb-2 flex items-center">
                            <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Procedimientos
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {servicio.procedimientos.map((procedimiento, index) => (
                              <motion.div 
                                key={`proc-${servicio.id}-${index}`} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="flex items-start group"
                                whileHover={{ scale: 1.01, x: 5 }}
                              >
                                <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-gray-700 group-hover:text-blue-800 transition-colors duration-300">{procedimiento}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Consultorías para Derecho Administrativo */}
                      {servicio.consultorias && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 }}
                          className="mb-8"
                        >
                          <h4 className="text-lg font-semibold text-blue-800 mb-4 border-b border-gray-200 pb-2 flex items-center">
                            <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Consultorías Jurídicas Especializadas
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {servicio.consultorias.map((consultoria, index) => (
                              <motion.div 
                                key={`cons-${servicio.id}-${index}`} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="flex items-start group"
                                whileHover={{ scale: 1.01, x: 5 }}
                              >
                                <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-gray-700 group-hover:text-blue-800 transition-colors duration-300">{consultoria}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Categorías para Derecho Civil */}
                      {servicio.categorias && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          {/* Tabs navigation */}
                          <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-2 overflow-x-auto pb-1 scrollbar-hide">
                              {servicio.categorias.map((categoria) => (
                                <button
                                  key={categoria.nombre}
                                  onClick={() => setActiveTab(categoria.nombre)}
                                  className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm rounded-t-lg transition-colors duration-200 ${
                                    activeTab === categoria.nombre
                                      ? 'border-blue-600 text-blue-800 bg-blue-50'
                                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                  }`}
                                >
                                  {categoria.nombre}
                                </button>
                              ))}
                            </nav>
                          </div>

                          {/* Tab panels */}
                          <div className="pt-6">
                            {servicio.categorias.map((categoria) => (
                              <div key={categoria.nombre} className={activeTab === categoria.nombre ? 'block' : 'hidden'}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {categoria.items.map((item, itemIndex) => (
                                    <motion.div 
                                      key={`item-${servicio.id}-${itemIndex}`} 
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.2, delay: itemIndex * 0.05 }}
                                      className="flex items-start group"
                                      whileHover={{ scale: 1.01, x: 5 }}
                                    >
                                      <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      <span className="text-gray-700 group-hover:text-blue-800 transition-colors duration-300">{item}</span>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-16"
        >
          <a
            href="/contacto"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all inline-block shadow-md hover:shadow-lg hover:scale-105"
          >
            Solicite una Asesoría Jurídica Especializada
          </a>
        </motion.div>
      </div>
    </section>
  )
}
