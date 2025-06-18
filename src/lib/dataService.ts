import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { readJsonFile, writeJsonFile, generateId, slugify } from './fileUtils';
import { NewsItem } from '@/components/ui/NewsCard';
import { Testimonial } from '../data/testimonials';

const unlinkAsync = promisify(fs.unlink);
const copyFileAsync = promisify(fs.copyFile);

// Define paths
const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

const NEWS_FILE = path.join(DATA_DIR, 'news.json');
const TESTIMONIALS_FILE = path.join(DATA_DIR, 'testimonials.json');

// News Service
export const NewsService = {
  async getAll(): Promise<NewsItem[]> {
    return await readJsonFile<NewsItem[]>(NEWS_FILE, []);
  },

  async getById(id: string): Promise<NewsItem | undefined> {
    const news = await this.getAll();
    return news.find(item => item.id === id);
  },

  async getBySlug(slug: string): Promise<NewsItem | undefined> {
    const news = await this.getAll();
    return news.find(item => item.slug === slug);
  },

  async getByCategory(category: string): Promise<NewsItem[]> {
    const news = await this.getAll();
    return news.filter(item => item.category === category);
  },

  async getAllCategories(): Promise<string[]> {
    const news = await this.getAll();
    const categories = new Set(news.map(item => item.category));
    return Array.from(categories);
  },

  async create(newsItem: Omit<NewsItem, 'id' | 'slug'>, tempImagePath?: string): Promise<NewsItem> {
    const news = await this.getAll();
    
    const newNewsItem: NewsItem = {
      ...newsItem,
      id: generateId(),
      slug: slugify(newsItem.title),
    };

    // Handle image upload if provided
    if (tempImagePath) {
      const filename = `${newNewsItem.id}-${path.basename(tempImagePath)}`;
      const destPath = path.join(UPLOADS_DIR, 'news', filename);
      await copyFileAsync(tempImagePath, destPath);
      newNewsItem.image = `/uploads/news/${filename}`;
    }

    news.push(newNewsItem);
    await writeJsonFile(NEWS_FILE, news);
    return newNewsItem;
  },

  async update(id: string, newsItem: Partial<NewsItem>, tempImagePath?: string): Promise<NewsItem | null> {
    const news = await this.getAll();
    const index = news.findIndex(item => item.id === id);
    
    if (index === -1) {
      return null;
    }

    // Update news item
    const updatedItem = { ...news[index], ...newsItem };
    
    // Update slug if title changed
    if (newsItem.title) {
      updatedItem.slug = slugify(newsItem.title);
    }

    // Handle image upload if provided
    if (tempImagePath) {
      // Delete old image if exists and not a default image
      const oldImage = news[index].image;
      if (oldImage && oldImage.startsWith('/uploads/')) {
        try {
          await unlinkAsync(path.join(process.cwd(), 'public', oldImage));
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }

      // Save new image
      const filename = `${id}-${path.basename(tempImagePath)}`;
      const destPath = path.join(UPLOADS_DIR, 'news', filename);
      await copyFileAsync(tempImagePath, destPath);
      updatedItem.image = `/uploads/news/${filename}`;
    }

    news[index] = updatedItem;
    await writeJsonFile(NEWS_FILE, news);
    return updatedItem;
  },

  async delete(id: string): Promise<boolean> {
    const news = await this.getAll();
    const index = news.findIndex(item => item.id === id);
    
    if (index === -1) {
      return false;
    }

    // Delete image if exists
    const oldImage = news[index].image;
    if (oldImage && oldImage.startsWith('/uploads/')) {
      try {
        await unlinkAsync(path.join(process.cwd(), 'public', oldImage));
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    news.splice(index, 1);
    await writeJsonFile(NEWS_FILE, news);
    return true;
  }
};

// Testimonials Service
export const TestimonialsService = {
  async getAll(): Promise<Testimonial[]> {
    return await readJsonFile<Testimonial[]>(TESTIMONIALS_FILE, []);
  },

  async getById(id: string): Promise<Testimonial | undefined> {
    const testimonials = await this.getAll();
    return testimonials.find(item => item.id === id);
  },

  async getByType(type: 'text' | 'video'): Promise<Testimonial[]> {
    const testimonials = await this.getAll();
    return testimonials.filter(item => item.type === type);
  },

  async create(testimonial: Omit<Testimonial, 'id'>, tempImagePath?: string): Promise<Testimonial> {
    const testimonials = await this.getAll();
    
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: generateId()
    };

    // Handle image upload if provided
    if (tempImagePath) {
      const filename = `${newTestimonial.id}-${path.basename(tempImagePath)}`;
      const destPath = path.join(UPLOADS_DIR, 'testimonials', filename);
      await copyFileAsync(tempImagePath, destPath);
      newTestimonial.image = `/uploads/testimonials/${filename}`;
    }

    testimonials.push(newTestimonial);
    await writeJsonFile(TESTIMONIALS_FILE, testimonials);
    return newTestimonial;
  },

  async update(id: string, testimonial: Partial<Testimonial>, tempImagePath?: string): Promise<Testimonial | null> {
    const testimonials = await this.getAll();
    const index = testimonials.findIndex(item => item.id === id);
    
    if (index === -1) {
      return null;
    }

    const updatedTestimonial = { ...testimonials[index], ...testimonial };

    // Handle image upload if provided
    if (tempImagePath) {
      // Delete old image if exists
      const oldImage = testimonials[index].image;
      if (oldImage && oldImage.startsWith('/uploads/')) {
        try {
          await unlinkAsync(path.join(process.cwd(), 'public', oldImage));
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }

      // Save new image
      const filename = `${id}-${path.basename(tempImagePath)}`;
      const destPath = path.join(UPLOADS_DIR, 'testimonials', filename);
      await copyFileAsync(tempImagePath, destPath);
      updatedTestimonial.image = `/uploads/testimonials/${filename}`;
    }

    testimonials[index] = updatedTestimonial;
    await writeJsonFile(TESTIMONIALS_FILE, testimonials);
    return updatedTestimonial;
  },

  async delete(id: string): Promise<boolean> {
    const testimonials = await this.getAll();
    const index = testimonials.findIndex(item => item.id === id);
    
    if (index === -1) {
      return false;
    }

    // Delete image if exists
    const oldImage = testimonials[index].image;
    if (oldImage && oldImage.startsWith('/uploads/')) {
      try {
        await unlinkAsync(path.join(process.cwd(), 'public', oldImage));
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    testimonials.splice(index, 1);
    await writeJsonFile(TESTIMONIALS_FILE, testimonials);
    return true;
  }
};
