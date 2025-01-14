'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

const errorMessages: { [key: string]: string } = {
  OAuthAccountNotLinked: 'Já existe uma conta com este email usando outro método de login. Por favor, faça login usando o método original.',
  AccessDenied: 'Acesso negado. Por favor, tente novamente.',
  Default: 'Ocorreu um erro durante o login. Por favor, tente novamente.'
};

export function ErrorMessage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  if (!error) return null;

  return (
    <div className="mb-6 p-4 text-sm text-red-400 bg-red-950/50 border border-red-900/50 rounded-lg" role="alert">
      {errorMessages[error as keyof typeof errorMessages] || errorMessages.Default}
    </div>
  );
} 