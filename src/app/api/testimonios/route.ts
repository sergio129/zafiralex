import { NextResponse } from 'next/server'

// Esto es una simulación de una base de datos
// En una aplicación real, usarías Prisma u otro ORM
const testimonios = [
  {
    id: 1,
    name: "María González",
    position: "Directora General",
    company: "TechCorp Solutions",
    testimonial: "Zafira transformó completamente nuestra operación. Su equipo profesional y sus soluciones innovadoras nos ayudaron a alcanzar nuestros objetivos de manera eficiente.",
    rating: 5,
    type: 'text'
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    position: "CEO",
    company: "Innovate Plus",
    testimonial: "El servicio al cliente de Zafira es excepcional. Siempre están disponibles cuando los necesitamos y sus respuestas son rápidas y efectivas.",
    rating: 5,
    type: 'text'
  },
  {
    id: 3,
    name: "Ana Martínez",
    position: "Gerente de Proyectos",
    company: "Global Enterprises",
    testimonial: "Trabajar con Zafira ha sido una experiencia increíble. Su atención al detalle y compromiso con la calidad superó todas nuestras expectativas.",
    rating: 5,
    videoId: "dQw4w9WgXcQ",
    type: 'video'
  }
]

// GET /api/testimonios - Obtener todos los testimonios
export async function GET() {
  return NextResponse.json(testimonios)
}

// POST /api/testimonios - Crear un nuevo testimonio
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validación básica
    if (!body.name || !body.testimonial) {
      return NextResponse.json(
        { error: "El nombre y el testimonio son obligatorios" },
        { status: 400 }
      )
    }
    
    // Crear nuevo testimonio
    const nuevoTestimonio = {
      id: Math.max(0, ...testimonios.map(t => t.id)) + 1,
      ...body
    }
      // En una app real, aquí guardarías en la base de datos
    testimonios.push(nuevoTestimonio)
    
    return NextResponse.json(nuevoTestimonio, { status: 201 })
  } catch (_error) {
    console.error("Error al crear testimonio:", _error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
}
