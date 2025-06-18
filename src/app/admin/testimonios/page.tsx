'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Testimonial } from '@/data/testimonials';

export default function TestimoniosAdmin() {
  const [testimonios, setTestimonios] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonios = async () => {
      try {
        const response = await fetch('/api/admin/testimonios');
        if (!response.ok) {
          throw new Error('Error al cargar los testimonios');
        }
        const data = await response.json();
        setTestimonios(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonios();
  }, []);

  // Estado para un nuevo testimonio
  const [newTestimonio, setNewTestimonio] = useState<Omit<Testimonial, 'id'>>({
    name: "",
    position: "",
    company: "",
    content: "",
    rating: 5,
    videoUrl: "",
    type: 'text'
  });
  // Estado para el ID del testimonio que se está editando (null si no se está editando ninguno)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
  const handleAddTestimonio = async () => {
    try {
      setIsSubmitting(true);
      
      const formData = new FormData();
      formData.append('name', newTestimonio.name);
      if (newTestimonio.position) formData.append('position', newTestimonio.position);
      if (newTestimonio.company) formData.append('company', newTestimonio.company);
      formData.append('content', newTestimonio.content);
      formData.append('type', newTestimonio.type);
      formData.append('rating', String(newTestimonio.rating || 5));
      
      if (newTestimonio.type === 'video' && newTestimonio.videoUrl) {
        formData.append('videoUrl', newTestimonio.videoUrl);
      }
      
      const response = await fetch('/api/admin/testimonios/create', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Error al crear el testimonio');
      }
      
      const newTestimonioData = await response.json();
      
      // Actualizar la lista de testimonios
      setTestimonios([...testimonios, newTestimonioData]);
      
      // Reiniciar el formulario
      setNewTestimonio({
        name: "",
        position: "",
        company: "",
        content: "",
        rating: 5,
        videoUrl: "",
        type: 'text'
      });
      
      setSuccessMessage('Testimonio agregado correctamente');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Comenzar a editar un testimonio
  const startEditing = (testimonio: Testimonial) => {
    setEditingId(testimonio.id);
  };

  // Cancelar la edición
  const cancelEditing = () => {
    setEditingId(null);
  };

  // Guardar cambios en un testimonio
  const handleSaveChanges = async () => {
    if (!editingId) return;
    
    try {
      setIsSubmitting(true);
      
      const testimonioToUpdate = testimonios.find(t => t.id === editingId);
      if (!testimonioToUpdate) return;
      
      const formData = new FormData();
      formData.append('name', testimonioToUpdate.name);      if (testimonioToUpdate.position) formData.append('position', testimonioToUpdate.position);
      if (testimonioToUpdate.company) formData.append('company', testimonioToUpdate.company);
      formData.append('content', testimonioToUpdate.content);
      formData.append('type', testimonioToUpdate.type);
      formData.append('rating', String(testimonioToUpdate.rating ?? 5));
      
      if (testimonioToUpdate.type === 'video' && testimonioToUpdate.videoUrl) {
        formData.append('videoUrl', testimonioToUpdate.videoUrl);
      }
      
      const response = await fetch(`/api/admin/testimonios/${editingId}`, {
        method: 'PUT',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar el testimonio');
      }
      
      setSuccessMessage('Testimonio actualizado correctamente');
      setTimeout(() => setSuccessMessage(null), 3000);
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar un testimonio
  const handleDeleteTestimonio = async (id: string) => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/admin/testimonios/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar el testimonio');
      }
      
      setTestimonios(testimonios.filter(t => t.id !== id));
      if (editingId === id) {
        cancelEditing();
      }
      
      setSuccessMessage('Testimonio eliminado correctamente');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsSubmitting(false);
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

        {/* Formulario de nuevo testimonio */}        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
            <p>{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {editingId !== null ? 'Editar Testimonio' : 'Agregar Nuevo Testimonio'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">            <div>              <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">Nombre</label>
              <input 
                id="name"
                type="text" 
                name="name"
                value={editingId !== null 
                  ? testimonios.find(t => t.id === editingId)?.name ?? "" 
                  : newTestimonio.name
                }
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>
              <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-800 mb-1">Cargo</label>
              <input 
                id="position"
                type="text" 
                name="position"
                value={editingId !== null 
                  ? testimonios.find(t => t.id === editingId)?.position ?? "" 
                  : newTestimonio.position ?? ""
                }
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>
            
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-800 mb-1">Empresa</label>
              <input 
                id="company"
                type="text" 
                name="company"
                value={editingId !== null 
                  ? testimonios.find(t => t.id === editingId)?.company ?? "" 
                  : newTestimonio.company ?? ""
                }
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>
            
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-800 mb-1">Calificación (1-5)</label>
              <input 
                id="rating"
                type="number" 
                name="rating"
                min="1"
                max="5"
                value={editingId !== null 
                  ? testimonios.find(t => t.id === editingId)?.rating ?? 5 
                  : newTestimonio.rating ?? 5
                }
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-800 mb-1">Tipo de testimonio</label>
              <select 
                id="type"
                name="type"
                value={editingId !== null 
                  ? testimonios.find(t => t.id === editingId)?.type ?? "text" 
                  : newTestimonio.type
                }
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              >                <option value="text">Texto</option>
                <option value="video">Video de YouTube</option>
              </select>
            </div>
            
            {(editingId !== null 
              ? testimonios.find(t => t.id === editingId)?.type === 'video'
              : newTestimonio.type === 'video') && (
              <div>
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-800 mb-1">URL del video de YouTube</label>
                <input 
                  id="videoUrl"
                  type="text" 
                  name="videoUrl"
                  placeholder="Ejemplo: https://www.youtube.com/embed/dQw4w9WgXcQ"
                  value={editingId !== null 
                    ? testimonios.find(t => t.id === editingId)?.videoUrl ?? "" 
                    : newTestimonio.videoUrl ?? ""
                  }
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
                <p className="text-xs text-gray-600 mt-1">URL completa del video (debe ser formato embed)</p>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-800 mb-1">Testimonio</label>
            <textarea 
              id="content"
              name="content"
              rows={4}
              value={editingId !== null 
                ? testimonios.find(t => t.id === editingId)?.content ?? "" 
                : newTestimonio.content
              }
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            />
          </div>
          
          <div className="flex justify-end">
            {editingId !== null ? (
              <>
                <button 
                  onClick={cancelEditing}
                  className="mr-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </>
            ) : (
              <button 
                onClick={handleAddTestimonio}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                disabled={isSubmitting || !newTestimonio.name || !newTestimonio.content}
              >
                {isSubmitting ? 'Agregando...' : 'Agregar testimonio'}
              </button>
            )}
          </div>
        </div>

        {/* Lista de testimonios */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-semibold p-6 border-b border-gray-200 text-gray-800">
            Testimonios existentes
          </h2>
            {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Empresa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Calificación</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {testimonios.map(testimonio => (
                    <tr key={testimonio.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {testimonio.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {testimonio.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {testimonio.type === 'text' ? 'Texto' : (
                          <div className="flex items-center">
                            <span>Video</span>
                            {testimonio.videoUrl && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                URL: {testimonio.videoUrl.substring(0, 15)}...
                              </span>
                            )}
                          </div>
                        )}
                      </td>                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((starValue) => (
                            <svg 
                              key={`${testimonio.id}-star-${starValue}`} 
                              className={`h-5 w-5 ${starValue <= (testimonio.rating ?? 5) ? 'text-yellow-400' : 'text-gray-300'}`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                        <button 
                          onClick={() => startEditing(testimonio)}
                          className="text-blue-600 hover:text-blue-900 mr-3 font-medium"
                          disabled={isSubmitting}
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDeleteTestimonio(testimonio.id)}
                          className="text-red-600 hover:text-red-900 font-medium"
                          disabled={isSubmitting}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {testimonios.length === 0 && !loading && (
                <div className="p-6 text-center text-gray-500">
                  No hay testimonios disponibles.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Instrucciones</h3>
          <p className="text-blue-700 mb-3">
            Usa este panel para administrar los testimonios que se muestran en la página pública.
          </p>
          <ul className="list-disc list-inside text-blue-700 space-y-1">
            <li>Los testimonios pueden ser de tipo texto o video de YouTube</li>
            <li>Para videos de YouTube, proporciona la URL completa del embed (https://www.youtube.com/embed/ID)</li>
            <li>Todos los cambios se guardan automáticamente en el sistema de archivos</li>
            <li>Asegúrate de que todos los campos obligatorios estén completos</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
