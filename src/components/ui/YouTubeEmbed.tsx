'use client'

import { useState, useCallback } from 'react'

interface YouTubeEmbedProps {
  videoId: string
  title?: string
  className?: string
}

export default function YouTubeEmbed({ videoId, title = 'YouTube video player', className = '' }: YouTubeEmbedProps) {
  const [isLoading, setIsLoading] = useState(true)
  
  // Función para manejar cuando el iframe ha cargado
  const handleIframeLoaded = useCallback(() => {
    setIsLoading(false)
  }, [])

  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Cargando video...</p>
          </div>
        </div>
      )}
      <iframe 
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={handleIframeLoaded}
      />
    </div>
  )
}
