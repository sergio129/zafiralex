'use client'

import { useState } from 'react'
import Link from 'next/link'

// Tipo para un testimonio
type TestimonialType = {
  id: number;
  name: string;
  position: string;
  company: string;
  testimonial: string;
  rating: number;
  videoId?: string;
  type: 'text' | 'video';
};

export default function TestimoniosAdmin() {
  // Ejemplo de datos iniciales (en una app real, estos vendrían de una API o base de datos)
  const [testimonios, setTestimonios] = useState<TestimonialType[]>([
    {
      id: 1,
      name: "María González",
      position: "Directora General",
      company: "TechCorp Solutions",
      testimonial: "Zafira transformó completamente nuestra operación. Su equipo profesional y sus soluciones innovadoras nos ayudaron a alcanzar nuestros objetivos de manera eficiente.",
      rating: 5,
      type: 'text'
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      position: "CEO",
      company: "Innovate Plus",
      testimonial: "El servicio al cliente de Zafira es excepcional. Siempre están disponibles cuando los necesitamos y sus respuestas son rápidas y efectivas.",
      rating: 5,
      type: 'text'
    },
    {
      id: 3,
      name: "Ana Martínez",
      position: "Gerente de Proyectos",
      company: "Global Enterprises",
      testimonial: "Trabajar con Zafira ha sido una experiencia increíble. Su atención al detalle y compromiso con la calidad superó todas nuestras expectativas.",
      rating: 5,
      videoId: "dQw4w9WgXcQ",
      type: 'video'
    }
  ]);

  // Estado para un nuevo testimonio
  const [newTestimonio, setNewTestimonio] = useState<Omit<TestimonialType, 'id'>>({
    name: "",
    position: "",
    company: "",
    testimonial: "",
    rating: 5,
    videoId: "",
    type: 'text'
  });

  // Estado para el ID del testimonio que se está editando (null si no se está editando ninguno)
  const [editingId, setEditingId] = useState<number | null>(null);

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (editingId !== null) {
      // Editando un testimonio existente
      setTestimonios(testimonios.map(t => 
        t.id === editingId 
          ? { ...t, [name]: name === 'rating' ? Number(value) : value }
          : t
      ));
    } else {
      // Creando un nuevo testimonio
      setNewTestimonio({
        ...newTestimonio,
        [name]: name === 'rating' ? Number(value) : value
      });
    }
  };

  // Agregar un nuevo testimonio
  const handleAddTestimonio = () => {
    const id = Math.max(0, ...testimonios.map(t => t.id)) + 1;
    setTestimonios([...testimonios, { ...newTestimonio, id }]);
    setNewTestimonio({
      name: "",
      position: "",
      company: "",
      testimonial: "",
      rating: 5,
      videoId: "",
      type: 'text'
    });
  };

  // Comenzar a editar un testimonio
  const startEditing = (testimonio: TestimonialType) => {
    setEditingId(testimonio.id);
  };

  // Cancelar la edición
  const cancelEditing = () => {
    setEditingId(null);
  };

  // Eliminar un testimonio
  const handleDeleteTestimonio = (id: number) => {
    setTestimonios(testimonios.filter(t => t.id !== id));
    if (editingId === id) {
      cancelEditing();
    }
  };

  return (
    <main className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Administración de Testimonios</h1>
          <Link 
            href="/testimonios" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Ver testimonios
          </Link>
        </div>

        {/* Formulario de nuevo testimonio */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {editingId !== null ? 'Editar Testimonio' : 'Agregar Nuevo Testimonio'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input 
                type="text" 
                name="name"
                value={editingId !== null 
                  ? testimonios.find(t => t.id === editingId)?.name || "" 
                  : newTestimonio.name
                }
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
              <input 
                type="text" 
                name="position"
                value={editingId !== null 
                  ? testimonios.find(t => t.id === editingId)?.position || "" 
                  : newTestimonio.position
                }
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
              <input 
                type="text" 
                name="company"
                value={editingId !== null 
                  ? testimonios.find(t => t.id === editingId)?.company || "" 
                  : newTestimonio.company
                }
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Calificación (1-5)</label>
              <input 
                type="number" 
                name="rating"
                min="1"
                max="5"
                value={editingId !== null 
                  ? testimonios.find(t => t.id === editingId)?.rating || 5 
                  : newTestimonio.rating
                }
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de testimonio</label>
              <select 
                name="type"
                value={editingId !== null 
                  ? testimonios.find(t => t.id === editingId)?.type || "text" 
                  : newTestimonio.type
                }
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="text">Texto</option>
                <option value="video">Video de YouTube</option>
              </select>
            </div>
            
            {(editingId !== null 
              ? testimonios.find(t => t.id === editingId)?.type === 'video'
              : newTestimonio.type === 'video') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID del video de YouTube</label>
                <input 
                  type="text" 
                  name="videoId"
                  placeholder="Ejemplo: dQw4w9WgXcQ"
                  value={editingId !== null 
                    ? testimonios.find(t => t.id === editingId)?.videoId || "" 
                    : newTestimonio.videoId || ""
                  }
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">ID del video (aparece en la URL después de v=)</p>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Testimonio</label>
            <textarea 
              name="testimonial"
              rows={4}
              value={editingId !== null 
                ? testimonios.find(t => t.id === editingId)?.testimonial || "" 
                : newTestimonio.testimonial
              }
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex justify-end">
            {editingId !== null ? (
              <>
                <button 
                  onClick={cancelEditing}
                  className="mr-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => setEditingId(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Guardar cambios
                </button>
              </>
            ) : (
              <button 
                onClick={handleAddTestimonio}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                disabled={!newTestimonio.name || !newTestimonio.testimonial}
              >
                Agregar testimonio
              </button>
            )}
          </div>
        </div>

        {/* Lista de testimonios */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-semibold p-6 border-b border-gray-200 text-gray-800">
            Testimonios existentes
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calificación</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {testimonios.map(testimonio => (
                  <tr key={testimonio.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {testimonio.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {testimonio.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {testimonio.type === 'text' ? 'Texto' : (
                        <div className="flex items-center">
                          <span>Video</span>
                          {testimonio.videoId && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              ID: {testimonio.videoId.substring(0, 6)}...
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`h-5 w-5 ${i < testimonio.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      <button 
                        onClick={() => startEditing(testimonio)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDeleteTestimonio(testimonio.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {testimonios.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No hay testimonios disponibles.
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Nota sobre la persistencia de datos</h3>
          <p className="text-blue-700">
            Esta es una interfaz de demostración. En una implementación real, necesitarías:
          </p>
          <ul className="list-disc list-inside mt-2 text-blue-700 space-y-1">
            <li>Conectar con una API o base de datos (como PostgreSQL con Prisma)</li>
            <li>Implementar autenticación para proteger esta página de administración</li>
            <li>Agregar validación de formularios</li>
            <li>Implementar manejo de imágenes para fotos de perfil</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
