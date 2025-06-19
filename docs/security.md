# Mejoras de Seguridad en Zafira

Este documento describe las medidas de seguridad implementadas en el proyecto Zafira para protegerlo contra diferentes tipos de ataques y amenazas de seguridad.

## 1. Protección contra XSS (Cross-Site Scripting)

### Implementación

- **Sanitización de entradas**: Se ha implementado una biblioteca personalizada (`sanitizeUtils.ts`) que sanitiza todo el contenido generado por el usuario.
- **Sanitización HTML**: Se permite HTML limitado solo donde es necesario, con etiquetas y atributos específicos permitidos.
- **Sanitización de texto plano**: Se elimina todo el HTML en campos de texto plano.
- **DOMPurify**: Se utiliza la biblioteca DOMPurify para sanitizar HTML de forma segura.
- **Cabecera Content-Security-Policy**: Se ha implementado para restringir las fuentes de contenido permitidas.

### Ubicación en el código

- `src/lib/sanitizeUtils.ts`: Biblioteca de sanitización
- `src/lib/securityHeaders.ts`: Cabeceras de seguridad, incluyendo CSP
- `src/app/api/admin/news/create/route.ts` y otras rutas API: Aplicación de sanitización

## 2. Protección contra CSRF (Cross-Site Request Forgery)

### Implementación

- **Tokens CSRF**: Se genera un token CSRF único para cada sesión utilizando la Web Crypto API.
- **Double Submit Cookie**: Se utiliza el patrón de "doble envío de cookies" para validar solicitudes.
- **SameSite Cookies**: Se configuran las cookies como `SameSite=strict`.
- **Middleware de validación**: Se verifica el token CSRF en todas las operaciones que modifican estado (POST, PUT, DELETE).
- **Compatibilidad con Edge Runtime**: La implementación utiliza la Web Crypto API en lugar de Node.js crypto para mantener compatibilidad con Next.js Edge Runtime.

### Ubicación en el código

- `src/lib/csrfProtection.ts`: Implementación principal de CSRF
- `src/middleware.ts`: Aplicación del middleware CSRF
- `src/lib/csrfClient.ts`: Utilidades de cliente para integrar CSRF en el frontend

## 3. Rate Limiting

### Implementación

- **Límites específicos por ruta**: Se han configurado diferentes límites según el tipo de endpoint.
- **Límites más estrictos para autenticación**: Previene ataques de fuerza bruta.
- **Cabeceras informativas**: Se incluyen cabeceras para informar sobre el estado del rate limiting.
- **Almacenamiento en memoria**: Actualmente se usa almacenamiento en memoria, se recomienda migrar a Redis para entornos de producción con múltiples instancias.

### Ubicación en el código

- `src/lib/rateLimit.ts`: Implementación del rate limiting
- `src/middleware.ts`: Aplicación del rate limiting a diferentes rutas

## 4. Cabeceras de Seguridad

### Implementación

- **Content-Security-Policy**: Restringe las fuentes de contenido para prevenir XSS y otras inyecciones.
- **X-XSS-Protection**: Activa la protección XSS del navegador.
- **X-Content-Type-Options**: Previene MIME-sniffing.
- **Strict-Transport-Security**: Fuerza el uso de HTTPS.
- **X-Frame-Options**: Previene clickjacking.
- **Referrer-Policy**: Controla cómo se comparte la información del referrer.
- **Permissions-Policy**: Restringe el acceso a características del navegador.

### Ubicación en el código

- `src/lib/securityHeaders.ts`: Definición de cabeceras de seguridad
- `src/middleware.ts`: Aplicación de cabeceras a todas las respuestas

## 5. Validación de Archivos

### Implementación

- **Validación de tipo MIME**: Se verifica que los archivos subidos sean del tipo esperado.
- **Límites de tamaño**: Se establecen límites para el tamaño de los archivos.
- **Verificación de contenido**: Se realiza una verificación básica del encabezado de archivo para confirmar que es realmente del tipo declarado.
- **Nombres de archivo seguros**: Se sanitizan los nombres de archivo para prevenir path traversal.

### Ubicación en el código

- `src/lib/fileValidation.ts`: Implementación de validación de archivos
- `src/app/api/admin/news/create/route.ts` y otras rutas de subida: Aplicación de validación

## 6. Sanitización SQL

### Implementación

- **Prisma con parámetros preparados**: Prisma utiliza parámetros preparados por defecto, lo que previene SQL Injection.
- **Validación adicional**: Se aplica una capa adicional de sanitización para IDs y parámetros de URL.
- **Validación de tipos**: Se garantiza que los tipos de datos sean correctos antes de enviarlos a la base de datos.

### Ubicación en el código

- `src/lib/sanitizeUtils.ts`: Funciones `sanitizeSQLParam` y `validateId`
- Rutas API: Implementación de estas funciones

## Recomendaciones para el futuro

1. **Auditoría de seguridad**: Realizar auditorías de seguridad periódicas.
2. **Redis para rate limiting**: Implementar almacenamiento en Redis para rate limiting en entornos multi-instancia.
3. **Logging de seguridad**: Implementar un sistema de logging específico para eventos de seguridad.
4. **Política de contraseñas**: Establecer reglas más estrictas para las contraseñas de los usuarios.
5. **Pruebas de penetración**: Realizar pruebas de penetración regulares para identificar vulnerabilidades.
6. **Actualizaciones de dependencias**: Mantener todas las dependencias actualizadas con herramientas como Dependabot.
7. **Monitoreo de seguridad**: Implementar herramientas de monitoreo de seguridad en tiempo real.

## Integración de las protecciones en el frontend

Para que las protecciones funcionen correctamente, es necesario integrarlas en el frontend. A continuación se muestran algunos ejemplos:

### Ejemplo de uso de CSRF en formularios

```tsx
import { getCSRFHeaders, fetchWithCSRF } from '@/lib/csrfClient';

// En un formulario React
const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  try {
    const response = await fetchWithCSRF('/api/admin/news/create', {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      // Éxito
    } else {
      // Error
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```
