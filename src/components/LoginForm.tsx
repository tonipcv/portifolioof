'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface LoginFormProps {
  buttonClassName?: string;
}

export function LoginForm({ buttonClassName }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Iniciando tentativa de login:', { email });

      // Enviar dados como application/x-www-form-urlencoded
      const formData = new URLSearchParams();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('redirect', 'false');
      formData.append('callbackUrl', callbackUrl);

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      console.log('Resultado do login:', {
        ok: result?.ok,
        error: result?.error,
        status: result?.status,
        url: result?.url
      });

      if (!result) {
        throw new Error("Não foi possível conectar ao servidor");
      }

      if (!result.ok) {
        console.error('Erro no login:', {
          error: result.error,
          status: result.status
        });
        
        if (result.error === "Email não encontrado") {
          throw new Error("Email não encontrado");
        } else if (result.error === "Senha incorreta") {
          throw new Error("Senha incorreta");
        } else {
          throw new Error(result.error || "Erro ao fazer login");
        }
      }

      console.log('Login bem-sucedido, redirecionando para:', callbackUrl);
      router.push(callbackUrl);
      router.refresh();
    } catch (error: any) {
      console.error('Erro capturado no formulário:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      });
      setError(error?.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#333333] border border-[#444444] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">
            Senha
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#333333] border border-[#444444] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-zinc-800/30 border border-green-100/20 
              text-zinc-100 rounded-lg transition-all duration-300 
              hover:bg-zinc-700/50 hover:border-green-100/40 
              focus:outline-none focus:ring-2 focus:ring-green-100/30
              font-light tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </form>
    </div>
  );
} 