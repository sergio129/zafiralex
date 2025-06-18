import News from '@/components/sections/News';

export default function NoticiasPage() {
  return (
    <main className="pt-20">
      <div className="py-10 bg-blue-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
            Noticias
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            Últimas noticias y actualizaciones del ámbito jurídico
          </p>
        </div>
      </div>
      <News />
    </main>
  );
}
