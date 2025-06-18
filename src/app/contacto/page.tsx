import Contact from '@/components/sections/Contact';

export default function ContactoPage() {
  return (
    <main className="pt-20">
      <div className="py-10 bg-blue-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
            Contáctenos
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            Estamos listos para ayudarle con cualquier consulta jurídica
          </p>
        </div>
      </div>
      <Contact />
    </main>
  );
}
