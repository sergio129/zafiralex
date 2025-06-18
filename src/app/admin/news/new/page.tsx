'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CreateNewsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('summary', formData.excerpt); // Usamos excerpt pero lo enviamos como summary para el backend
      formDataToSend.append('content', formData.content);
      formDataToSend.append('category', formData.category);
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const response = await fetch('/api/admin/news/create', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la noticia');
      }

      router.push('/admin/news');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Crear Nueva Noticia</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Título
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
            Categoría
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="category"
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="excerpt">
            Resumen
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={3}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
            Contenido
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={10}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
            Imagen
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />          {imagePreview && (
            <div className="mt-2">
              <div className="relative h-40 w-auto">
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
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Noticia'}
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => router.push('/admin/news')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
