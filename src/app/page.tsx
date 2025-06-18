import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import News from '@/components/sections/News'
import Testimonials from '@/components/sections/Testimonials'
import Contact from '@/components/sections/Contact'

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <News />
      <Testimonials />
      <Contact />
    </main>
  );
}
