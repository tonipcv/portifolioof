'use client';

import React, { useEffect } from 'react';

export interface PandaPlayerProps {
  videoId: string;
}

export function PandaPlayer({ videoId }: PandaPlayerProps) {
  useEffect(() => {
    // Carrega o script do Panda Player
    const script = document.createElement('script');
    script.src = 'https://player.pandavideo.com.br/api.v2.js';
    script.async = true;
    document.body.appendChild(script);

    // Adiciona a autenticação quando o script carregar
    script.onload = () => {
      // @ts-ignore - o window.pandavideo é adicionado pelo script
      window.pandavideo = {
        api_key: process.env.NEXT_PUBLIC_PANDA_API_KEY, // Você precisa adicionar sua chave de API aqui
        player_id: 'panda-player',
      };
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
      <iframe
        id="panda-player"
        src={`https://player.pandavideo.com.br/embed/?v=${videoId}&api_key=${process.env.NEXT_PUBLIC_PANDA_API_KEY}`}
        style={{
          border: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
} 