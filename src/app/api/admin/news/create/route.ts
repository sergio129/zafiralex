import { NextResponse } from 'next/server';
import { slugify } from '@/lib/fileUtils';
import { prisma } from '@/lib/prisma';
import { sanitizeHTML, sanitizeText } from '@/lib/sanitizeUtils';
import { validateImage } from '@/lib/fileValidation';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Extraer y sanitizar datos del formulario
    const title = sanitizeText(formData.get('title') as string ?? '');
    const summary = sanitizeText(formData.get('summary') as string ?? '');
    // Permitimos HTML limitado en el contenido de las noticias
    const content = sanitizeHTML(formData.get('content') as string ?? '');
    const category = sanitizeText(formData.get('category') as string ?? '');
    const imageFile = formData.get('image') as File | null;
    
    // Validar datos
    if (!title || !summary || !content || !category) {
      return NextResponse.json(
        { message: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Generar slug para la noticia
    const slug = slugify(title);
    const date = new Date(); // Fecha actual
    
    let imageData: Buffer | null = null;
    let imageName: string | null = null;
    let mimeType: string | null = null;
      // Procesar imagen si se proporcionó
    if (imageFile && imageFile instanceof File) {
      try {
        // Validar la imagen para prevenir ataques
        const validationResult = await validateImage(imageFile, {
          maxSizeBytes: 10 * 1024 * 1024, // 10MB máximo
          allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
        });
        
        if (!validationResult.valid) {
          return NextResponse.json(
            { message: 'Error en la imagen', errors: validationResult.errors },
            { status: 400 }
          );
        }
        
        // Guardar el nombre original del archivo
        imageName = imageFile.name;
        // Guardar el tipo MIME
        mimeType = imageFile.type;
        
        console.log('Procesando imagen:', mimeType, imageName);
        
        // Obtener datos binarios de la imagen
        const arrayBuffer = await imageFile.arrayBuffer();
        imageData = Buffer.from(arrayBuffer);
        
        console.log('Imagen procesada correctamente, tamaño:', imageData.length);
      } catch (imageError) {
        console.error('Error al procesar imagen:', imageError);
        // Continuamos sin imagen si hay error
        imageData = null;
        imageName = null;
        mimeType = null;
      }
    }
      // Crear noticia en la base de datos con los datos binarios de la imagen
    const newNews = await prisma.news.create({
      data: {
        title,
        summary,
        content, 
        date,
        imageData: imageData ?? undefined,
        imageName: imageName ?? undefined,
        mimeType: mimeType ?? undefined,
        category,
        slug
      }
    });
    
    return NextResponse.json(newNews, { status: 201 });
  } catch (error) {
    console.error('Error al crear noticia:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
