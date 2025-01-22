'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirect: false
      });

      if (res?.ok) {
        router.push('/portfolios');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-sm p-8 bg-zinc-950/70 rounded-lg border border-zinc-600">
        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="Logo"
            width={120}
            height={36}
            className="mx-auto brightness-0 invert"
          />
        </div>

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="w-full mb-4 p-2 bg-zinc-800/30 border border-zinc-600 rounded"
            disabled={isLoading}
          />

          <input
            name="password"
            type="password"
            required
            placeholder="Senha"
            className="w-full mb-6 p-2 bg-zinc-800/30 border border-zinc-600 rounded"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-2 bg-zinc-800/30 border border-green-100/20 rounded"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
} 