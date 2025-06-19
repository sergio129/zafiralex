'use client';

import { useRef, useEffect } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Aceptar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      
      // Agregar un event listener para cerrar al hacer clic fuera del modal
      const handleBackdropClick = (e: MouseEvent) => {
        if (e.target === dialogRef.current) {
          onCancel();
        }
      };
      
      // Necesitamos hacer esto después de showModal()
      const dialog = dialogRef.current;
      if (dialog) {
        dialog.addEventListener('click', handleBackdropClick);
        return () => dialog.removeEventListener('click', handleBackdropClick);
      }
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen, onCancel]);

  return (
    <dialog
      ref={dialogRef}
      className={`fixed inset-0 z-50 p-4 bg-black/20 backdrop-blur-sm ${
        isOpen ? 'flex' : 'hidden'
      } items-center justify-center`}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 text-left">
        <div className="mb-4">
          <h3 className="text-xl font-medium text-gray-900">{title}</h3>
          <p className="mt-2 text-gray-600">{message}</p>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
