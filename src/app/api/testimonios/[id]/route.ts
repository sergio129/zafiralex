import { NextResponse } from 'next/server'

// Esto es una simulación de una base de datos
// En una aplicación real, usarías Prisma u otro ORM
let testimonios = [
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

// GET /api/testimonios/[id] - Obtener un testimonio específico
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)
  const testimonio = testimonios.find(t => t.id === id)
  
  if (!testimonio) {
    return NextResponse.json(
      { error: "Testimonio no encontrado" },
      { status: 404 }
    )
  }
  
  return NextResponse.json(testimonio)
}

// PUT /api/testimonios/[id] - Actualizar un testimonio
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id)
    const testimonio = testimonios.find(t => t.id === id)
    
    if (!testimonio) {
      return NextResponse.json(
        { error: "Testimonio no encontrado" },
        { status: 404 }
      )
    }
    
    const body = await request.json()
    
    // Validación básica
    if (!body.name || !body.testimonial) {
      return NextResponse.json(
        { error: "El nombre y el testimonio son obligatorios" },
        { status: 400 }
      )
    }
    
    // Actualizar testimonio
    const testimonioActualizado = { ...testimonio, ...body, id }
    testimonios = testimonios.map(t => 
      t.id === id ? testimonioActualizado : t
    )
    
    return NextResponse.json(testimonioActualizado)
  } catch (error) {
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
}

// DELETE /api/testimonios/[id] - Eliminar un testimonio
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id)
    const testimonio = testimonios.find(t => t.id === id)
    
    if (!testimonio) {
      return NextResponse.json(
        { error: "Testimonio no encontrado" },
        { status: 404 }
      )
    }
    
    // Eliminar testimonio
    testimonios = testimonios.filter(t => t.id !== id)
    
    return NextResponse.json({ message: "Testimonio eliminado correctamente" })
  } catch (error) {
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
}
