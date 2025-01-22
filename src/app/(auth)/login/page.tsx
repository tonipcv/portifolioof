'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface SignInResponse {
  error?: string;
  status?: number;
  ok?: boolean;
  url?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      });

      if (!result) {
        throw new Error('Não foi possível conectar ao servidor');
      }

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.ok) {
        router.push('/portfolios');
        router.refresh();
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-helvetica">
      <div className="w-full max-w-sm px-8 py-10 bg-zinc-950/70 backdrop-blur-sm rounded-lg border border-zinc-600">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={120}
            height={36}
            className="mx-auto mb-8 brightness-0 invert"
          />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-800/30 border border-zinc-600 rounded-lg 
                placeholder:text-zinc-400 text-zinc-100
                focus:outline-none focus:ring-2 focus:ring-green-100/30 focus:border-green-100/40"
              disabled={isLoading}
            />
          </div>

          <div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-800/30 border border-zinc-600 rounded-lg 
                placeholder:text-zinc-400 text-zinc-100
                focus:outline-none focus:ring-2 focus:ring-green-100/30 focus:border-green-100/40"
              disabled={isLoading}
            />
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

        <div className="mt-6 flex justify-between text-sm font-light tracking-wide">
          <Link
            href="/register"
            className="text-zinc-400 hover:text-green-100/90 transition-colors duration-300"
          >
            Criar conta
          </Link>
          <Link
            href="/forgot-password"
            className="text-zinc-400 hover:text-green-100/90 transition-colors duration-300"
          >
            Esqueceu sua senha?
          </Link>
        </div>
      </div>
    </div>
  );
} 