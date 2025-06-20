import Hero from '@/components/sections/Hero'
import ExecutiveServicesWrapper from '@/components/wrappers/ExecutiveServicesWrapper'
import Link from 'next/link'

export default function Home() {
  const featuredSections = [
    {
      id: "servicios",
      title: "Servicios Jurídicos",
      description: "Explore nuestra amplia gama de servicios jurídicos especializados",
      icon: (
        <svg className="h-10 w-10 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      link: "/servicios"
    },
    {
      id: "noticias",
      title: "Noticias Legales",
      description: "Manténgase actualizado con las últimas noticias y cambios en la legislación",
      icon: (
        <svg className="h-10 w-10 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      link: "/noticias"
    },
    {
      id: "testimonios",
      title: "Testimonios",
      description: "Vea lo que nuestros clientes dicen sobre nuestros servicios",
      icon: (
        <svg className="h-10 w-10 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      link: "/testimonios"
    },
  ];

  return (
    <main>
      {/* Proceso Ejecutivos Highlighted Section - Ahora como sección principal */}
      <ExecutiveServicesWrapper />
      
      {/* Hero Section - Movido después de los servicios ejecutivos */}
      <Hero />
      
      {/* Featured sections */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Explora Nuestra Plataforma</h2>
            <p className="mt-4 text-xl text-gray-600">
              Navega por nuestras secciones para descubrir todo lo que ofrecemos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredSections.map((section) => (
              <Link href={section.link} key={section.id} className="block">
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl hover:translate-y-[-5px] transition-all duration-300 h-full flex flex-col">
                  <div className="mb-4">{section.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{section.title}</h3>
                  <p className="text-gray-600 flex-grow">{section.description}</p>
                  <div className="mt-6 text-blue-600 font-medium flex items-center">
                    Explorar
                    <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link href="/contacto" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all inline-block shadow-md hover:shadow-lg">
              Contáctenos Hoy Mismo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
