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
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "María Rodríguez",
    company: "Empresa ABC",
    position: "Directora General",
    content: "El despacho nos ha proporcionado un servicio excepcional en materia de derecho mercantil. Su asesoramiento fue clave para la expansión de nuestra empresa.",
    type: "text",
    rating: 5
  },
  {
    id: "2",
    name: "Juan López",
    company: "Constructora XYZ",
    position: "CEO",
    content: "La asesoría recibida en temas fiscales ha sido fundamental para optimizar nuestra estructura corporativa.",
    type: "text",
    rating: 5
  },
  {
    id: "3",
    name: "Ana Martínez",
    company: "Startup Tech",
    position: "Fundadora",
    content: "Su experiencia en propiedad intelectual nos ayudó a proteger nuestras innovaciones de manera eficaz.",
    type: "video",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    rating: 5
  }
];

export function getAllTestimonials(): Testimonial[] {
  return testimonials;
}

export function getTestimonialsByType(type: 'text' | 'video'): Testimonial[] {
  return testimonials.filter(item => item.type === type);
}

export function getTestimonialById(id: string): Testimonial | undefined {
  return testimonials.find(item => item.id === id);
}
