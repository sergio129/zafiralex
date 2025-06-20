'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DocumentosPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [user, setUser] = useState<{id: string, name: string, email: string, role: string} | null>(null);
  const [viewDocument, setViewDocument] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [hoverPreview, setHoverPreview] = useState<{doc: any, x: number, y: number} | null>(null);
  
  // Estados para filtros
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [docRef, setDocRef] = useState("");
  const [searchTitle, setSearchTitle] = useState("");

  // Obtener el usuario actual
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch('/api/admin/auth/me');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      }
    };
    
    getUser();
  }, []);
  // Cargar documentos desde la API  // Función para aplicar filtros a los documentos
  const applyFilters = () => {
    if (!documents || documents.length === 0) return;
    
    let filtered = [...documents];
    
    // Filtrar por número de documento/referencia
    if (docRef.trim() !== "") {
      filtered = filtered.filter(doc => 
        doc.documentRef.toLowerCase().includes(docRef.toLowerCase())
      );
    }
    
    // Filtrar por título
    if (searchTitle.trim() !== "") {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }
    
    // Filtrar por fecha desde
    if (dateFrom.trim() !== "") {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter(doc => 
        new Date(doc.createdAt) >= fromDate
      );
    }
    
    // Filtrar por fecha hasta
    if (dateTo.trim() !== "") {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999); // Establecer al final del día
      filtered = filtered.filter(doc => 
        new Date(doc.createdAt) <= toDate
      );
    }
    
    setFilteredDocuments(filtered);
  };
  
  // Observar cambios en los filtros y aplicarlos
  useEffect(() => {
    applyFilters();
  }, [documents, docRef, searchTitle, dateFrom, dateTo]);

  // Cargar documentos desde la API
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/admin/documents');
        if (res.ok) {
          const data = await res.json();
          if (data.documents) {
            setDocuments(data.documents);
            setFilteredDocuments(data.documents);
          } else {
            setDocuments(data); // Para compatibilidad si la API devuelve directamente un array
            setFilteredDocuments(data);
          }
        } else {
          console.error('Error al obtener documentos');
        }
      } catch (error) {
        console.error('Error al cargar documentos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDocuments();
  }, []);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Documentos</h1>
          {user?.role === 'abogado' && (
            <p className="text-sm text-gray-600 mt-1">
              Solo se muestran los documentos que usted ha subido
            </p>
          )}
          {user?.role !== 'abogado' && (
            <p className="text-sm text-gray-600 mt-1">
              Se muestran todos los documentos del sistema
            </p>
          )}
        </div>
        <Link 
          href="/admin/documentos/nuevo"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Subir Documento
        </Link>
      </div>      {/* Filtros de búsqueda */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="text-lg font-medium mb-4">Filtros de búsqueda</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="docRef" className="block text-sm font-medium text-gray-700 mb-1">
              Número de Referencia
            </label>
            <input
              type="text"
              id="docRef"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="20250620-12345"
              value={docRef}
              onChange={(e) => setDocRef(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="searchTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Título del Documento
            </label>
            <input
              type="text"
              id="searchTitle"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Buscar por título..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Desde
            </label>
            <input
              type="date"
              id="dateFrom"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Hasta
            </label>
            <input
              type="date"
              id="dateTo"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={() => {
              setDocRef("");
              setSearchTitle("");
              setDateFrom("");
              setDateTo("");
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md mr-2"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <p className="mt-2 text-gray-600">Cargando documentos...</p>
          </div>
        ) : filteredDocuments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subido por
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>              <tbody className="bg-white divide-y divide-gray-200">
                {documents.map((doc: any) => (
                  <tr key={doc.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md">
                          <svg className="h-6 w-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {doc.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            Ref: {doc.documentRef}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {doc.category || 'Sin categoría'}
                      </span>
                    </td>                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.uploader?.name || doc.uploadedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">                      <button
                        onClick={() => {
                          setViewDocument(doc);
                          setShowPreview(true);
                        }}
                        onMouseEnter={(e) => {
                          setHoverPreview({
                            doc,
                            x: e.clientX,
                            y: e.clientY
                          });
                        }}
                        onMouseLeave={() => setHoverPreview(null)}
                        className="text-blue-600 hover:text-blue-900 mr-2"
                      >
                        Ver
                      </button>
                      <a 
                        href={doc.fileUrl} 
                        download={doc.fileName}
                        className="text-green-600 hover:text-green-900 mr-2"
                      >
                        Descargar
                      </a>
                      <button 
                        onClick={async () => {
                          if (confirm('¿Está seguro de que desea eliminar este documento?')) {
                            try {
                              const res = await fetch(`/api/admin/documents/${doc.id}`, {
                                method: 'DELETE'
                              });
                              if (res.ok) {
                                setDocuments(documents.filter((d: any) => d.id !== doc.id));
                              } else {
                                alert('Error al eliminar el documento');
                              }
                            } catch (error) {
                              console.error('Error:', error);
                              alert('Error al eliminar el documento');
                            }
                          }
                        }}
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
        ) : (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-2 text-lg text-gray-600">No hay documentos disponibles</p>
            <p className="text-gray-500">Comience subiendo un nuevo documento.</p>
          </div>
        )}
      </div>      {/* Modal de vista previa de documento */}
      {showPreview && viewDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-screen overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {viewDocument.title} <span className="text-sm text-gray-500">({viewDocument.documentRef})</span>
              </h3>
              <button 
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
              {/* Información del documento */}
              <div className="w-full md:w-1/3 p-4 border-r overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Descripción</h4>
                    <p className="mt-1">{viewDocument.description || 'Sin descripción'}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Categoría</h4>
                    <p className="mt-1">{viewDocument.category || 'Sin categoría'}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Etiquetas</h4>
                    <p className="mt-1">{viewDocument.tags || 'Sin etiquetas'}</p>
                  </div>
                    <div>
                    <h4 className="text-sm font-medium text-gray-500">Subido por</h4>
                    <p className="mt-1">{viewDocument.uploader?.name || viewDocument.uploadedBy}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Fecha de creación</h4>
                    <p className="mt-1">{new Date(viewDocument.createdAt).toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Archivo</h4>
                    <p className="mt-1">{viewDocument.fileName}</p>
                    <p className="text-xs text-gray-500">
                      {(viewDocument.fileSize / 1024).toFixed(2)} KB • {viewDocument.mimeType}
                    </p>
                  </div>
                  
                  <div className="pt-4 flex space-x-2">
                    <a 
                      href={viewDocument.fileUrl} 
                      download={viewDocument.fileName}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Descargar
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Visor de documentos */}
              <div className="w-full md:w-2/3 flex-1 overflow-hidden flex flex-col">
                {viewDocument.mimeType?.includes('image/') ? (
                  <div className="flex-1 overflow-auto flex items-center justify-center bg-gray-100 p-4">
                    <img 
                      src={viewDocument.fileUrl} 
                      alt={viewDocument.title} 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : viewDocument.mimeType === 'application/pdf' ? (
                  <iframe 
                    src={viewDocument.fileUrl} 
                    className="w-full h-full border-0" 
                    title={viewDocument.title}
                  />
                ) : (
                  <div className="flex-1 overflow-auto flex items-center justify-center bg-gray-100 p-4">
                    <div className="text-center">
                      <div className="bg-white p-6 rounded-lg shadow-md">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Vista previa no disponible</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Este tipo de archivo no se puede previsualizar en el navegador.
                        </p>
                        <div className="mt-4">
                          <a
                            href={viewDocument.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            Abrir en nueva pestaña
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-800">
              Esta sección le permite gestionar documentos legales importantes. Puede subir, categorizar y compartir documentos con su equipo.
              {user?.role === 'abogado' && (
                <span className="block mt-2 font-medium">
                  Como abogado, solo puede ver los documentos que usted ha subido.
                </span>
              )}
            </p>
          </div>
        </div>      </div>
        {/* Vista previa flotante al pasar el mouse */}
      {hoverPreview && (        <div 
          className="fixed z-50 bg-white rounded-md shadow-xl border border-gray-200"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '700px',
            maxHeight: '600px',
            overflow: 'hidden'
          }}
        >
          <div className="p-2 border-b bg-gray-50 text-sm font-medium">
            {hoverPreview.doc.title}
          </div>
          <div className="p-2">
            {hoverPreview.doc.mimeType?.includes('image/') ? (
              <img 
                src={hoverPreview.doc.fileUrl} 
                alt={hoverPreview.doc.title} 
                className="w-full h-auto max-h-[200px] object-contain"
              />            ) : hoverPreview.doc.mimeType === 'application/pdf' ? (
              <div className="h-[400px] bg-gray-100">
                <iframe 
                  src={hoverPreview.doc.fileUrl} 
                  className="w-full h-full border-0" 
                  title={hoverPreview.doc.title}
                />
              </div>
            ) : hoverPreview.doc.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               hoverPreview.doc.mimeType === 'application/msword' ? (
              <div className="flex flex-col items-center justify-center h-[200px] bg-gray-100">
                <svg className="h-12 w-12 text-blue-600" fill="currentColor" viewBox="0 0 384 512">
                  <path d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM332.1 128H256V51.9l76.1 76.1zM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288H48zm220.1-208c-5.7 0-10.6-4-11.7-9.5-20.6-97.7-20.4-95.4-21-103.2-.2-1.5-1.4-2.5-3-2.5H140c-7.8 0-14-6.3-14-14V82c0-7.8 6.3-14 14-14h93.3c7.8 0 14 6.3 14 14v39.7c0 1.3.9 2.6 2 3.1 35.6 15.3 65.4 46.3 80.5 86.6 1.5 3.6 5 6 8.8 6h38.5c7.8 0 14 6.3 14 14v112c0 7.8-6.3 14-14 14H202.8c-7.8 0-14-6.3-14-14v-30.2c0-1.8-1.4-3.3-3.2-3.4-43.4-3.4-80.4-29.5-96.7-67.6-.9-1.9-2.9-3-5-2.9-2.1.1-3.9 1.4-4.7 3.4-1.7 4.3-3.7 8.4-5.9 12.3-2.1 3.7-3.7 7.7-5.1 11.7-1.3 3.8-3.6 7.1-6.9 9.3-3.3 2.2-7.1 3.2-10.9 3.2H14c-7.8 0-14-6.3-14-14v-78c0-7.8 6.3-14 14-14h37.7c3.8 0 7.6 1 10.9 3.2 3.3 2.2 5.6 5.5 6.9 9.3 1.3 3.9 2.9 7.8 4.9 11.4 2.1 3.9 4.1 7.9 6 12 .9 1.9 2.8 3.1 4.9 3.1 2.1 0 4-1.2 5-3.1 17-35.6 52.5-59.5 92.6-60.8 1.8-.1 3.2-1.6 3.2-3.4V169c0-7.8 6.3-14 14-14h92.8c7.8 0 14 6.3 14 14v30c0 7.8-6.3 14.1-14 14.1h-38.5z"/>
                </svg>
                <p className="mt-2 text-sm text-gray-600">Documento Word</p>
              </div>
            ) : hoverPreview.doc.mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
               hoverPreview.doc.mimeType === 'application/vnd.ms-excel' ? (
              <div className="flex flex-col items-center justify-center h-[200px] bg-gray-100">
                <svg className="h-12 w-12 text-green-600" fill="currentColor" viewBox="0 0 384 512">
                  <path d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM332.1 128H256V51.9l76.1 76.1zM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288H48zm32-48h224V288H80v128zm32-32h64v-32h-64v32zm96 0h64v-32h-64v32zM80 224h224V160H80v64zm32-32h64v-32h-64v32zm96 0h64v-32h-64v32z"/>
                </svg>
                <p className="mt-2 text-sm text-gray-600">Hoja de cálculo Excel</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] bg-gray-100">
                <svg className="h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 384 512">
                  <path d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM332.1 128H256V51.9l76.1 76.1zM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288H48z"/>
                </svg>
                <p className="mt-2 text-sm text-gray-600">No hay vista previa disponible</p>
              </div>
            )}
          </div>
          <div className="p-2 border-t bg-gray-50 text-xs text-gray-500">
            {hoverPreview.doc.documentRef} • {new Date(hoverPreview.doc.createdAt).toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
}
