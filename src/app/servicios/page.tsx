import Services from '@/components/sections/Services';

export default function ServiciosPage() {
  return (
    <main className="pt-20">
      <div className="py-10 bg-blue-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
            Nuestros Servicios
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            Conozca los servicios jurídicos especializados que ofrecemos
          </p>
        </div>
      </div>
      <Services />
    </main>
  );
}
