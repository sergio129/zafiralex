'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuItems = [
    { href: '/', label: 'Inicio' },
    { href: '/servicios', label: 'Nuestros Servicios' },
    { href: '/noticias', label: 'Noticias' },
    { href: '/testimonios', label: 'Testimonios' },
    { href: '/contacto', label: 'Contáctenos' },
  ]
  // Efecto para detectar scroll y cambiar el estilo del header
  useEffect(() => {
    // Comprobar inmediatamente el estado de scroll al cargar
    setScrolled(window.scrollY > 50);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);return (
    <header className="fixed w-full top-0 z-50 transition-all duration-300 bg-blue-950 shadow-md py-3" style={{ 
      background: 'linear-gradient(to right, #0c2b5a, #0a3069)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo-icon.svg" alt="Zafira Lex Logo" className="h-10 w-10" />
              <span className="text-2xl font-bold transition-colors text-amber-400" style={{ color: '#f59e0b' }}>
                Zafira Lex Compañia Juridica
              </span>
            </Link>
          </div>          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors duration-200 font-medium text-white hover:text-amber-400"
                style={{ color: 'white' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus:outline-none transition-colors text-white"
              style={{ color: 'white' }}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 mt-4">
            <nav className="flex flex-col space-y-2 bg-blue-900 p-4 rounded-lg shadow-lg">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-100 hover:text-amber-400 transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
           