import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Excluir carpetas problemáticas del escaneo de webpack
  webpack: (config: any) => {
    // Evitar que webpack escanee carpetas del sistema con nombres problemáticos
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/.git/**', '**/node_modules/**', '**/Configuración local/**', '**/Local Settings/**']
    };
    return config;
  }
};

export default nextConfig;
