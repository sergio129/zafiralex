'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
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
  };

  // Skip layout for login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-center h-16 bg-indigo-600">
          <h2 className="text-xl font-bold text-white">Zafira Admin</h2>
        </div>
        <div className="p-4">
          <nav className="space-y-1">
            <Link 
              href="/admin/dashboard" 
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                isActive('/admin/dashboard')
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="truncate">Dashboard</span>
            </Link>
            <Link 
              href="/admin/news" 
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                isActive('/admin/news')
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="truncate">Noticias</span>
            </Link>
            <Link 
              href="/admin/testimonios" 
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                isActive('/admin/testimonios')
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="truncate">Testimonios</span>
            </Link>
          </nav>
        </div>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Content area */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-4 bg-white shadow lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 lg:hidden focus:outline-none"
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
          <div className="ml-auto">
            <Link href="/" target="_blank" className="text-sm text-indigo-600 hover:text-indigo-800">
              Ver sitio web
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
