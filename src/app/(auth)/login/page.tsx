'use client';

import * as React from 'react';
import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email ou senha inválidos');
        return;
      }

      router.push('/portfolios');
    } catch (error) {
      setError('Ocorreu um erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center font-helvetica px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={120}
            height={36}
            priority
            className="mx-auto mb-8 brightness-0 invert"
          />
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg border border-green-100/20 py-8 px-8">
          <div className="text-center mb-6">
            <h2 className="text-zinc-100 text-xl font-light mb-2">Fazer Login</h2>
            <p className="text-zinc-400 text-sm font-light">
              Entre com suas credenciais abaixo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-light text-zinc-300 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-10 bg-zinc-800/30 border border-green-100/20 
                    rounded-lg py-2 text-zinc-100 placeholder-zinc-500 
                    focus:outline-none focus:ring-2 focus:ring-green-100/30 focus:border-green-100/30 
                    transition-all duration-300 font-light text-sm"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-light text-zinc-300">
                  Senha
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors duration-300 font-light"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 bg-zinc-800/30 border border-green-100/20 
                    rounded-lg py-2 text-zinc-100 placeholder-zinc-500 
                    focus:outline-none focus:ring-2 focus:ring-green-100/30 focus:border-green-100/30 
                    transition-all duration-300 font-light text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 text-red-400 p-3 rounded-md text-sm font-light">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-zinc-800/30 border border-green-100/20 
                text-zinc-100 rounded-lg transition-all duration-300 
                hover:bg-zinc-700/50 hover:border-green-100/40 
                focus:outline-none focus:ring-2 focus:ring-green-100/30
                font-light tracking-wide flex items-center justify-center
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-zinc-300 border-t-transparent rounded-full animate-spin" />
              ) : (
                'Entrar'
              )}
            </button>

            <div className="text-center">
              <Link 
                href="https://s.cryph.ai/cadastro"
                className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors duration-300 font-light"
              >
                Não tem uma conta? Cadastre-se
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 