'use client';

import Link from 'next/link';

export default function AdminSiteNav() {
  const menuItems = [
    { href: '/', label: 'Inicio' },
    { href: '/servicios', label: 'Nuestros Servicios' },
    { href: '/noticias', label: 'Noticias' },
    { href: '/testimonios', label: 'Testimonios' },
    { href: '/contacto', label: 'Contáctenos' },
  ];

  return (
    <nav className="bg-blue-700 text-white py-1.5 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex-shrink-0">
          <Link href="/" target="_blank" className="text-xl font-bold text-white hover:text-blue-200 transition-colors">
            Zafira Lex
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target="_blank"
              className="px-3 py-2 text-sm font-medium text-white hover:bg-blue-800 rounded transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/"
            target="_blank"
            className="ml-4 px-4 py-2 text-sm font-medium text-blue-700 bg-white rounded-md hover:bg-blue-50 transition-colors shadow-sm flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Ver sitio web
          </Link>
        </div>
        <div className="md:hidden">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-white rounded-md hover:bg-blue-50 transition-colors shadow-sm flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Ver sitio
          </Link>
        </div>
      </div>
    </nav>
  );
}
