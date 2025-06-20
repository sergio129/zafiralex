'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'info' | 'warning' | 'error' | 'success';
}

export default function AlertDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Aceptar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  type = 'warning'
}: AlertDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  
  // Prevenir scroll cuando el diálogo está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // Función para detectar Escape y cerrar el diálogo
      const handleEscKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onCancel();
      };
      
      document.addEventListener('keydown', handleEscKey);
      return () => {
        document.removeEventListener('keydown', handleEscKey);
        document.body.style.overflow = 'auto';
      };
    }
  }, [isOpen, onCancel]);
  
  // No renderizar nada si no está abierto
  if (!isOpen) return null;

  // Determinar colores según el tipo de diálogo
  const getColors = () => {
    switch(type) {
      case 'warning':
        return {
          icon: 'text-amber-600 bg-amber-100',
          button: 'bg-amber-600 hover:bg-amber-700'
        };
      case 'error':
        return {
          icon: 'text-red-600 bg-red-100',
          button: 'bg-red-600 hover:bg-red-700'
        };
      case 'success':
        return {
          icon: 'text-emerald-600 bg-emerald-100',
          button: 'bg-emerald-600 hover:bg-emerald-700'
        };
      case 'info':
      default:
        return {
          icon: 'text-blue-600 bg-blue-100',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
    }
  };

  // Obtener el icono según el tipo
  const getIcon = () => {
    switch(type) {
      case 'warning':
        return (
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'success':
        return (
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const colors = getColors();  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          {/* Overlay de fondo con backdrop blur */}          <motion.div 
            className="fixed inset-0 bg-slate-700/20 backdrop-blur-[2px]"
            onClick={onCancel}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
          
          {/* Contenedor de centrado */}
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            {/* Diálogo con animación */}
            <motion.div 
              ref={dialogRef}
              className="relative overflow-hidden rounded-xl bg-white text-left shadow-xl ring-1 ring-gray-200 w-full max-w-lg"
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 300 
              }}
            >
              {/* Borde superior con color según el tipo */}
              <motion.div 
                className={`h-1.5 w-full ${colors.button.replace('hover:', '')}`}
                layoutId="dialog-border"
              ></motion.div>
              
              <div className="p-6 sm:p-8">
                {/* Encabezado con icono */}
                <div className="flex items-start">
                  <div className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${colors.icon} mr-4`}>
                    {getIcon()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold leading-6 text-gray-800">
                      {title}
                    </h3>
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">
                        {message}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Botones de acción */}
                <div className="mt-8 flex flex-row-reverse gap-4">
                  <motion.button
                    type="button"
                    className={`inline-flex justify-center items-center rounded-md border border-transparent px-5 py-2.5 text-sm font-medium text-white shadow-sm ${colors.button} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                    onClick={onConfirm}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {confirmLabel}
                  </motion.button>
                  <motion.button
                    type="button"
                    className="inline-flex justify-center items-center rounded-md border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                    onClick={onCancel}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {cancelLabel}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
