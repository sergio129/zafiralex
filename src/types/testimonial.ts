/**
 * Tipos compartidos para testimoniales
 */

export interface Testimonial {
  id: string;
  name: string;
  company?: string;
  position?: string;
  content: string;
  type: 'text' | 'video';
  videoUrl?: string;
  image?: string;
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
