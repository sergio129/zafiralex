import Testimonials from '@/components/sections/Testimonials';

export default function TestimoniosPage() {
  return (
    <main className="pt-20">
      <div className="py-10 bg-blue-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
            Testimonios
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            La opinión de nuestros clientes es nuestro mayor orgullo
          </p>
        </div>
      </div>
      <Testimonials />
    </main>
  );
}
