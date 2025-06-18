'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Testimonial } from '@/data/testimonials';
import Image from 'next/image';

// Tipo para el componente de página dinámica en Next.js
type EditarTestimonioProps = {
  params: {
    id: string;
  }
};

export default function EditarTestimonio({ params }: Readonly<EditarTestimonioProps>) {
  const router = useRouter();
  const { id } = params;
  
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    position: '',
    content: '',
    type: 'text' as 'text' | 'video',
    videoUrl: '',
    rating: 5,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonio = async () => {
      try {
        const response = await fetch(`/api/admin/testimonios/${id}`);
        if (!response.ok) {
          throw new Error('Error al cargar el testimonio');
        }
        const data: Testimonial = await response.json();
        setFormData({
          name: data.name,
          company: data.company || '',
          position: data.position || '',
          content: data.content,
          type: data.type,
          videoUrl: data.videoUrl || '',
          rating: data.rating || 5,
        });
        
        if (data.image) {
          setCurrentImage(data.image);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setLoading(false);
      }
    };

    fetchTestimonio();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('company', formData.company);
      formDataToSend.append('position', formData.position);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('rating', String(formData.rating));

      if (formData.type === 'video') {
        formDataToSend.append('videoUrl', formData.videoUrl);
      }

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const response = await fetch(`/api/admin/testimonios/${id}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el testimonio');
      }

      router.push('/admin/testimonios');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="spinner">Cargando...</div>
        </div>
      </div>
    );
  }

  if (error && !submitting) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Editar Testimonio</h1>

      {error && submitting && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Nombre del Cliente
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company">
            Empresa
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="company"
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="position">
            Cargo
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="position"
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
            Tipo de Testimonio
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="text">Texto</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
            Contenido del Testimonio
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="content"
            name="content"
            rows={5}
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>

        {formData.type === 'video' && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="videoUrl">
              URL del Video (YouTube, Vimeo, etc.)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="videoUrl"
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="https://www.youtube.com/embed/..."
              required={formData.type === 'video'}
            />
            <p className="text-sm text-gray-500 mt-1">
              Utilice el formato de URL insertable (embed), como https://www.youtube.com/embed/XXXXXX
            </p>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
            Valoración
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
          >
            <option value="1">1 Estrella</option>
            <option value="2">2 Estrellas</option>
            <option value="3">3 Estrellas</option>
            <option value="4">4 Estrellas</option>
            <option value="5">5 Estrellas</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
            Imagen del Cliente
          </label>
          {currentImage && !imagePreview && (
            <div className="mb-2">
              <p className="text-sm text-gray-600 mb-2">Imagen actual:</p>              <div className="relative h-40 w-full">
                <Image 
                  src={currentImage} 
                  alt="Imagen actual" 
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
          )}
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">Nueva imagen:</p> <div className="relative h-40 w-full">
                <Image 
                  src={imagePreview} 
                  alt="Vista previa"
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => router.push('/admin/testimonios')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

