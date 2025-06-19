/**
 * Tipos compartidos para noticias
 */

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string | Date;
  image?: string;
  imageAlt?: string;
  category: string;
  slug: string;
  featured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
