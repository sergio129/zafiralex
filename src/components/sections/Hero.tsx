export default function Hero() {
  return (
    <section className="bg-gradient-zafira text-white pt-20" style={{ background: 'linear-gradient(135deg, #2c6fc1, #0c2e59)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">          {/* Content */}
          <div className="space-y-8">
            <div className="mb-10 fade-in" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-3xl font-bold mb-4">Ofrecemos soluciones</h2>
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
             Soluciones jurídicas <span className="text-blue-300">efectivas</span> y <span className="text-blue-300">personalizadas</span>
              </h1>
            </div>  
           <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl">
                  Somos expertos en servicios jurídicos de alta calidad, comprometidos con la defensa de tus derechos y la satisfacción de tus necesidades legales.
            </p>
              <div className="flex flex-col sm:flex-row gap-4 fade-in" style={{ animationDelay: '0.6s' }}>
              <a
                href="/servicios"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors text-center hover-grow"
              >
                VER MÁS
              </a>
              <a
                href="/contacto"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors text-center hover-grow"
              >
                CONTÁCTANOS
              </a>
            </div>
          </div>          {/* Stats */}
          <div className="relative fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm shadow-lg">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-blue-500 bg-opacity-30 rounded-lg p-6 text-center hover-grow">
                  <div className="text-4xl font-bold mb-2 counter-animation">500+</div>
                  <div className="text-blue-100">Clientes Satisfechos</div>
                </div>
                <div className="bg-blue-500 bg-opacity-30 rounded-lg p-6 text-center hover-grow">
                  <div className="text-4xl font-bold mb-2 counter-animation">1+</div>
                  <div className="text-blue-100">Años de Experiencia</div>
                </div>
                <div className="bg-blue-500 bg-opacity-30 rounded-lg p-6 text-center hover-grow">
                  <div className="text-4xl font-bold mb-2 counter-animation">24/7</div>
                  <div className="text-blue-100">Soporte Disponible</div>
                </div>
                <div className="bg-blue-500 bg-opacity-30 rounded-lg p-6 text-center hover-grow">
                  <div className="text-4xl font-bold mb-2 counter-animation">100%</div>
                  <div className="text-blue-100">Calidad Garantizada</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
