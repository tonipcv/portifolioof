'use client';

import { useSession } from 'next-auth/react';

export function SubscriptionStatus() {
  const { data: session, update } = useSession();

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 p-4 rounded-lg shadow-lg">
      <p className="text-sm text-gray-300">
        Status: {session?.user?.subscriptionStatus || 'não definido'}
      </p>
      <button
        onClick={() => update()}
        className="mt-2 text-xs text-blue-400 hover:text-blue-300"
      >
        Atualizar Sessão
      </button>
    </div>
  );
} 