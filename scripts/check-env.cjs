// Script para verificar la configuración de variables de entorno críticas
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno desde .env
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Valores predeterminados que NO deben usarse en producción
const DEFAULT_VALUES = {
  JWT_SECRET: ['your-secret-key-change-in-production', 'CAMBIAR_ESTE_VALOR_POR_UN_SECRET_SEGURO'],
  NEXTAUTH_SECRET: ['CAMBIAR_ESTE_VALOR_POR_UN_SECRET_SEGURO'],
  ADMIN_PASSWORD: ['admin123', 'contraseña_segura', 'CAMBIAR_POR_UNA_CONTRASEÑA_SEGURA', 'AdminSecure2025!']
};

// Variables críticas que deben estar definidas
const CRITICAL_VARS = ['JWT_SECRET', 'DATABASE_URL', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'];

// Función para verificar si una variable tiene un valor por defecto
function isDefaultValue(name, value) {
  if (!DEFAULT_VALUES[name]) return false;
  return DEFAULT_VALUES[name].includes(value);
}

function checkEnvironmentVariables() {
  console.log('\x1b[36m%s\x1b[0m', '🔐 Verificando variables de entorno críticas...');
  
  let hasWarnings = false;
  let hasCriticalIssues = false;
  
  // Verificar variables críticas
  for (const varName of CRITICAL_VARS) {
    const value = process.env[varName];
    
    if (!value) {
      console.log('\x1b[31m%s\x1b[0m', `❌ ERROR: La variable ${varName} no está definida`);
      hasCriticalIssues = true;
      continue;
    }
    
    if (isDefaultValue(varName, value)) {
      console.log('\x1b[33m%s\x1b[0m', `⚠️ ADVERTENCIA: La variable ${varName} tiene un valor predeterminado inseguro`);
      hasWarnings = true;
    } else {
      console.log('\x1b[32m%s\x1b[0m', `✅ ${varName}: Configurada correctamente`);
    }
  }
  
  // Verificar NODE_ENV
  if (process.env.NODE_ENV === 'production') {
    console.log('\x1b[36m%s\x1b[0m', '🌐 Modo de producción detectado');
    
    // Verificaciones adicionales para producción
    if (hasWarnings) {
      console.log('\x1b[31m%s\x1b[0m', `
⚠️ ADVERTENCIA DE SEGURIDAD ⚠️
Algunas variables tienen valores predeterminados inseguros.
En modo producción, esto representa un riesgo de seguridad significativo.
Ejecute scripts/generate-secrets.cjs para generar valores seguros.
`);
    }
  }
  
  // Resultado final
  if (hasCriticalIssues) {
    console.log('\x1b[31m%s\x1b[0m', `
❌ Se encontraron problemas críticos con las variables de entorno.
   Por favor, configure correctamente su archivo .env usando .env.example como guía.
   Para generar secretos seguros, ejecute: node scripts/generate-secrets.cjs
`);
    return false;
  }
  
  if (hasWarnings) {
    console.log('\x1b[33m%s\x1b[0m', `
⚠️ Se encontraron advertencias con sus variables de entorno.
   Considere actualizar los valores predeterminados para mayor seguridad.
   Para generar secretos seguros, ejecute: node scripts/generate-secrets.cjs
`);
  } else {
    console.log('\x1b[32m%s\x1b[0m', `
✅ Todas las variables de entorno críticas están configuradas correctamente.
`);
  }
  
  return !hasWarnings;
}

// Ejecutar verificación
const result = checkEnvironmentVariables();

// Si se ejecuta directamente (no como módulo importado)
if (require.main === module) {
  if (!result && process.env.NODE_ENV === 'production') {
    console.error('Saliendo con código de error debido a problemas de configuración críticos');
    process.exit(1);
  }
}

module.exports = { checkEnvironmentVariables };
