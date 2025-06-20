'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NuevoDocumentoPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!file) {
      setError('Por favor seleccione un archivo');
      return;
    }
    
    if (!formData.title.trim()) {
      setError('El título es obligatorio');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Aquí iría la lógica de subida del archivo
      // const formDataToSend = new FormData();
      // formDataToSend.append('file', file);
      // formDataToSend.append('title', formData.title);
      // formDataToSend.append('description', formData.description);
      // formDataToSend.append('category', formData.category);
      // formDataToSend.append('tags', formData.tags);
      
      // const res = await fetch('/api/admin/documentos', {
      //   method: 'POST',
      //   body: formDataToSend
      // });
      
      // if (!res.ok) throw new Error('Error al subir el documento');

      // Simulamos un retraso
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      router.push('/admin/documentos');
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      setError('Ocurrió un error al subir el documento');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Subir Nuevo Documento</h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Título del Documento *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Categoría
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Seleccionar categoría</option>
              <option value="contratos">Contratos</option>
              <option value="demandas">Demandas</option>
              <option value="actas">Actas</option>
              <option value="poderes">Poderes</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Etiquetas (separadas por comas)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Ej. demanda, civil, propiedad"
            />
          </div>

          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">
              Archivo de Documento *
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                className="sr-only"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.png,.zip,.rar"
              />
              <label
                htmlFor="file"
                className="relative cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span>Seleccionar archivo</span>
              </label>
              <span className="ml-4 text-sm text-gray-500">
                {file ? file.name : 'No se ha seleccionado ningún archivo'}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Formatos admitidos: PDF, Word, Excel, PowerPoint, imágenes, ZIP, RAR
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isUploading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isUploading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Subiendo...
              </span>
            ) : (
              'Subir Documento'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
