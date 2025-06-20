'use client';
import { ReactNode } from 'react';
import ToastProvider from '@/components/ui/Toast';

export default function AdminProviders({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}
