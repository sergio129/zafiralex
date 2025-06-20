'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

// Función para obtener el título del encabezado según la ruta
const getHeaderTitle = (path: string): string => {
  if (path.includes('/admin/news')) {
    return 'Gestión de Noticias';
  } else if (path.includes('/admin/testimonios')) {
    return 'Gestión de Testimonios';
  } else if (path.includes('/admin/usuarios')) {
    return 'Gestión de Usuarios';
  } else if (path.includes('/admin/mensajes')) {
    return 'Gestión de Mensajes de Contacto';
  } else {
    return 'Panel de Control';
  }
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
      });
      router.push('/admin/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };  // Skip layout for login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar - always visible */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 flex justify-between items-center h-14">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="text-xl font-bold">Zafira Admin</Link>
          </div>
          
        </div>
      </div>
      
      {/* Mobile sidebar overlay */}      {isSidebarOpen && (
        <button
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden cursor-default"
          onClick={() => setSidebarOpen(false)}
          aria-label="Cerrar menú lateral"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform mt-14 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      ><div className="p-4">
          <nav className="space-y-2">
            <Link 
              href="/admin/dashboard" 
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                isActive('/admin/dashboard')
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="truncate">Dashboard</span>
            </Link>
            <Link 
              href="/admin/news" 
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                isActive('/admin/news')
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <span className="truncate">Noticias</span>
            </Link>
            <Link 
              href="/admin/testimonios" 
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                isActive('/admin/testimonios')
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="truncate">Testimonios</span>
            </Link>
            <Link 
              href="/admin/mensajes" 
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                isActive('/admin/mensajes')
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="truncate">Mensajes</span>
            </Link>
            <Link 
              href="/admin/usuarios" 
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                isActive('/admin/usuarios')
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="truncate">Usuarios</span>
            </Link>
          </nav>        </div>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-700 rounded-lg shadow hover:from-red-600 hover:to-red-800 transition-all"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar sesión
          </button>
        </div>      </aside>
      
      {/* Content area */}
      <div className="lg:pl-64 pt-14">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-4 bg-white shadow-sm lg:px-6 border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 lg:hidden focus:outline-none hover:text-blue-600 transition-colors"
            aria-label="Abrir menú lateral"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="flex-1 px-4">
            <h1 className="text-xl font-semibold text-gray-800">
              {getHeaderTitle(pathname)}
            </h1>
          </div>
        </header>{/* Main content */}
        <main className="p-4 lg:p-6 bg-gray-50 min-h-[calc(100vh-8rem)]">
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="py-4 px-6 text-center text-sm text-gray-500 border-t border-gray-200">
          <p>© 2025 Zafira Admin - Todos los derechos reservados</p>
        </footer>
      </div>
    </div>
  );
}
