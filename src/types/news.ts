/**
 * Tipos compartidos para noticias
 */

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string | Date;
  image?: string;            // Campo legacy - ruta a la imagen
  imageData?: Uint8Array | null;   // Datos binarios de la imagen
  imageName?: string | null;       // Nombre original del archivo
  mimeType?: string | null;        // Tipo MIME de la imagen
  imageAlt?: string;        // Texto alternativo para la imagen
  category: string;
  slug: string;
  featured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
