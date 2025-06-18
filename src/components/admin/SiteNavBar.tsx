'use client';

import Link from 'next/link';

export default function SiteNavBar() {
  const menuItems = [
    { href: '/', label: 'Inicio' },
    { href: '/servicios', label: 'Nuestros Servicios' },
    { href: '/noticias', label: 'Noticias' },
    { href: '/testimonios', label: 'Testimonios' },
    { href: '/contacto', label: 'Contáctenos' },
  ];

  return (
    <div className="bg-gray-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-end items-center py-2 space-x-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target="_blank"
              className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
