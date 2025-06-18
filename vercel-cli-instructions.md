# Instrucciones para vincular tu proyecto de Next.js a Vercel

Para asegurarte de que tu proyecto está correctamente vinculado a Vercel y GitHub, sigue estos pasos desde el terminal:

## 1. Vincular tu proyecto con Vercel

```bash
# Desde el directorio de tu proyecto
vercel link
```

## 2. Verificar la configuración actual

```bash
# Muestra información sobre el proyecto vinculado
vercel project
```

## 3. Forzar un despliegue manual (si es necesario)

```bash
# Realiza un despliegue manual
vercel deploy
```

## 4. Configurar el entorno de producción

```bash
# Para desplegar directamente a producción
vercel --prod
```

## 5. Actualizar configuración de git

```bash
# Ver la configuración actual de Git en tu proyecto
vercel git
```

Después de ejecutar estos comandos, tu proyecto debería estar correctamente vinculado y configurado para despliegue automático.
