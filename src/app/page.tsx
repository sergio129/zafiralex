import Hero from '@/components/sections/Hero'
import ExecutiveServicesWrapper from '@/components/wrappers/ExecutiveServicesWrapper'

export default function Home() {

  return (
    <main>
      {/* Proceso Ejecutivos Highlighted Section - Ahora como sección principal */}
      <ExecutiveServicesWrapper />
      
      {/* Hero Section - Movido después de los servicios ejecutivos */}
      <Hero />
      

    </main>
  );
}
