import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'testimonials');

// GET: Obtener un testimonio por ID
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: params.id }
    });
    
    if (!testimonial) {
      return NextResponse.json(
        { message: 'Testimonio no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(testimonial, { status: 200 });
  } catch (error) {
    console.error('Error al obtener testimonio:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT: Actualizar un testimonio
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const company = formData.get('company') as string;
    const position = formData.get('position') as string;
    const content = formData.get('content') as string;
    const type = formData.get('type') as 'text' | 'video';
    const videoUrl = formData.get('videoUrl') as string | null;
    const rating = parseInt(formData.get('rating') as string) || 5;
    const imageFile = formData.get('image') as File | null;
    
    if (!name || !content) {
      return NextResponse.json(
        { message: 'Nombre y contenido son obligatorios' },
        { status: 400 }
      );
    }

    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id: params.id }
    });
    
    if (!existingTestimonial) {
      return NextResponse.json(
        { message: 'Testimonio no encontrado' },
        { status: 404 }
      );
    }

    // Datos para actualización
    const updateData: any = {
      name,
      company: company || null,
      position: position || null,
      content,
      type,
      videoUrl: videoUrl || null,
      rating
    };
    
    // Manejar imagen si fue proporcionada
    if (imageFile && imageFile instanceof File) {
      if (existingTestimonial.image?.startsWith('/uploads/')) {
        try {
          const oldImagePath = path.join(process.cwd(), 'public', existingTestimonial.image);
          await unlinkAsync(oldImagePath);
        } catch (err) {
          console.error('Error al eliminar imagen anterior:', err);
        }
      }
      
      const fileExtension = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExtension}`;
      const filePath = path.join(UPLOADS_DIR, fileName);
      
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.promises.writeFile(filePath, buffer);
      
      updateData.image = `/uploads/testimonials/${fileName}`;
    }

    // Actualizar en base de datos
    const updatedTestimonial = await prisma.testimonial.update({
      where: { id: params.id },
      data: updateData
    });
    
    return NextResponse.json(updatedTestimonial, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar testimonio:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un testimonio
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: params.id }
    });
    
    if (!testimonial) {
      return NextResponse.json(
        { message: 'Testimonio no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar la imagen si existe
    if (testimonial.image?.startsWith('/uploads/')) {
      try {
        const imagePath = path.join(process.cwd(), 'public', testimonial.image);
        await unlinkAsync(imagePath);
      } catch (err) {
        console.error('Error al eliminar imagen:', err);
      }
    }

    // Eliminar de la base de datos
    await prisma.testimonial.delete({
      where: { id: params.id }
    });

    return NextResponse.json(
      { message: 'Testimonio eliminado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al eliminar testimonio:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
