'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Define el tipo para los mensajes de contacto
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  assignedTo: string | null;
}

export default function MessageDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [message, setMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusUpdated, setStatusUpdated] = useState(false);
  
  // Estado editable
  const [editedMessage, setEditedMessage] = useState({
    status: '',
    notes: '',
  });
  
  useEffect(() => {
    if (!id) return;
    
    const fetchMessage = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/contact/${id}`);
        
        if (!response.ok) {
          throw new Error('Error al cargar el mensaje');
        }
        
        const data = await response.json();
        setMessage(data);
        setEditedMessage({
          status: data.status,
          notes: data.notes || '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessage();
  }, [id]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusUpdated(false);
    
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: editedMessage.status,
          notes: editedMessage.notes,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar el mensaje');
      }
      
      const updatedMessage = await response.json();
      setMessage(updatedMessage);
      setStatusUpdated(true);
      
      // Ocultar notificación después de 3 segundos
      setTimeout(() => {
        setStatusUpdated(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedMessage({
      ...editedMessage,
      [name]: value,
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }
  
  if (error || !message) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error || 'Mensaje no encontrado'}</span>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Detalle del Mensaje</h1>
        <Link href="/admin/mensajes" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
          ← Volver a mensajes
        </Link>
      </div>
      
      {statusUpdated && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Estado actualizado correctamente
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Información de contacto</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Nombre:</span>
                  <p className="text-gray-900">{message.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Email:</span>
                  <p className="text-gray-900">{message.email}</p>
                </div>
                {message.phone && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Teléfono:</span>
                    <p className="text-gray-900">{message.phone}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-500">Fecha de envío:</span>
                  <p className="text-gray-900">{formatDate(message.createdAt)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Última actualización:</span>
                  <p className="text-gray-900">{formatDate(message.updatedAt)}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Mensaje</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Asunto:</span>
                  <p className="text-gray-900">{message.subject}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Mensaje:</span>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-1">
                    <p className="text-gray-900 whitespace-pre-wrap">{message.message}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">Gestión del mensaje</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  id="status"
                  name="status"
                  value={editedMessage.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Pendiente</option>
                  <option value="in-progress">En progreso</option>
                  <option value="completed">Completado</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notas internas
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={editedMessage.notes}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Añade notas internas sobre este mensaje..."
                ></textarea>
              </div>
              
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Actualizando...' : 'Actualizar estado'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-6 flex space-x-4">
        <a
          href={`mailto:${message.email}?subject=RE: ${message.subject}`}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 inline-flex items-center"
        >
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          Responder por email
        </a>
        
        {message.phone && (
          <a
            href={`tel:${message.phone}`}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            Llamar
          </a>
        )}
      </div>
    </div>
  );
}
