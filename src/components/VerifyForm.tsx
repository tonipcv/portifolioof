'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface VerifyFormProps {
  userId?: string;
}

export function VerifyForm({ userId }: VerifyFormProps) {
  const router = useRouter();
  const [whatsapp, setWhatsapp] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ whatsapp, userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao enviar código');
      }

      setStep('code');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao enviar código');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, whatsapp, userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Código inválido');
      }

      router.push('/verify/success');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao verificar código');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {step === 'phone' ? (
        <form onSubmit={handleSendCode} className="space-y-6">
          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-300">
              WhatsApp
            </label>
            <div className="mt-1">
              <input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+5571999999999"
                className="w-full px-3 py-2 bg-[#333333] border border-[#444444] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-zinc-800/30 border border-green-100/20 
              text-zinc-100 rounded-lg transition-all duration-300 
              hover:bg-zinc-700/50 hover:border-green-100/40 
              focus:outline-none focus:ring-2 focus:ring-green-100/30
              font-light tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Enviando...' : 'Enviar código'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-300">
              Código de verificação
            </label>
            <div className="mt-1">
              <input
                id="code"
                name="code"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className="w-full px-3 py-2 bg-[#333333] border border-[#444444] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-zinc-800/30 border border-green-100/20 
              text-zinc-100 rounded-lg transition-all duration-300 
              hover:bg-zinc-700/50 hover:border-green-100/40 
              focus:outline-none focus:ring-2 focus:ring-green-100/30
              font-light tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verificando...' : 'Verificar código'}
          </button>
        </form>
      )}
    </div>
  );
} 