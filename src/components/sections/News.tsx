export default function News() {
  const news = [
    {
      id: 1,
      title: "Nuevos Servicios de Consultoría Digital",
      date: "15 de Junio, 2025",
      excerpt: "Lanzamos nuestra nueva línea de servicios de consultoría digital para ayudar a las empresas en su transformación tecnológica.",
      image: "/api/placeholder/400/250",
      category: "Servicios"
    },
    {
      id: 2,
      title: "Certificación ISO 9001 Obtenida",
      date: "10 de Junio, 2025",
      excerpt: "Orgullosamente anunciamos que hemos obtenido la certificación ISO 9001, reafirmando nuestro compromiso con la calidad.",
      image: "/api/placeholder/400/250",
      category: "Certificaciones"
    },
    {
      id: 3,
      title: "Expansión a Nuevas Ciudades",
      date: "5 de Junio, 2025",
      excerpt: "Continuamos creciendo y ahora ofrecemos nuestros servicios en 5 nuevas ciudades del país.",
      image: "/api/placeholder/400/250",
      category: "Expansión"
    },
    {
      id: 4,
      title: "Programa de Responsabilidad Social",
      date: "1 de Junio, 2025",
      excerpt: "Lanzamos nuestro programa de responsabilidad social corporativa para contribuir al desarrollo de nuestras comunidades.",
      image: "/api/placeholder/400/250",
      category: "RSC"
    },
    {
      id: 5,
      title: "Nueva Alianza Estratégica",
      date: "28 de Mayo, 2025",
      excerpt: "Formamos una alianza estratégica con líderes de la industria para ofrecer soluciones más completas a nuestros clientes.",
      image: "/api/placeholder/400/250",
      category: "Alianzas"
    },
    {
      id: 6,
      title: "Reconocimiento a la Excelencia",
      date: "25 de Mayo, 2025",
      excerpt: "Recibimos el premio a la excelencia empresarial por nuestro compromiso con la calidad y la innovación.",
      image: "/api/placeholder/400/250",
      category: "Premios"
    }
  ]

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
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              {/* Image */}              <div className="h-48 bg-gradient-zafira flex items-center justify-center">
                <div className="text-white text-center">
                  <svg className="h-16 w-16 mx-auto mb-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                  </svg>
                  <p className="text-sm opacity-90">{article.category}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {article.category}
                  </span>
                  <span className="text-gray-500 text-sm ml-auto">{article.date}</span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                  <button className="text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center group">
                  Leer más
                  <svg className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>        {/* CTA */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg hover-grow">
            Ver Todas las Noticias
          </button>
        </div>
      </div>
    </section>
  )
}
