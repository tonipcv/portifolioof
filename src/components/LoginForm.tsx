'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

interface LoginFormProps {
  buttonClassName?: string;
}

export function LoginForm({ buttonClassName }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/portfolios';
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
        email: email.toLowerCase(),
        password,
        redirect: false,
      });

      if (!result?.ok) {
        setError('Email ou senha incorretos');
        return;
      }

      router.push(callbackUrl);
    } catch (error) {
      setError('Ocorreu um erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    signIn('google', { 
      callbackUrl,
      redirect: true
    });
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-800/30 border border-green-100/20 
          text-zinc-100 rounded-lg transition-all duration-300 
          hover:bg-zinc-700/50 hover:border-green-100/40 
          focus:outline-none focus:ring-2 focus:ring-green-100/30
          font-light tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Image 
          src="/google.svg" 
          alt="Google" 
          width={18} 
          height={18} 
          className="opacity-80"
        />
        Entrar com Google
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-zinc-950 text-gray-500">ou continue com</span>
        </div>
      </div>

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
      </form>
    </div>
  );
} 