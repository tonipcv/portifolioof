'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { User, Settings, CreditCard, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const isPremium = session?.user?.subscriptionStatus === 'premium';

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'subscription', name: 'Assinatura', icon: CreditCard },
    { id: 'settings', name: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Minha Conta</h1>
          <p className="mt-2 text-gray-400">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-green-100 text-green-100'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Conteúdo das Tabs */}
        <div className="bg-[#222222] rounded-lg p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Informações Pessoais</h3>
                <div className="mt-4 grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Nome</label>
                    <p className="mt-1 text-white">{session?.user?.name || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Email</label>
                    <p className="mt-1 text-white">{session?.user?.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-700">
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair da conta</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Status da Assinatura</h3>
                <div className="mt-4">
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      isPremium ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {isPremium ? 'Premium' : 'Gratuito'}
                    </span>
                    {!isPremium && (
                      <Link
                        href="/pricing"
                        className="text-green-100 hover:text-green-200 text-sm"
                      >
                        Fazer upgrade →
                      </Link>
                    )}
                  </div>
                  {isPremium && (
                    <button
                      onClick={() => window.location.href = '/api/create-portal-session'}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-black bg-green-100 hover:bg-green-200"
                    >
                      Gerenciar Assinatura
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Preferências</h3>
                <p className="mt-1 text-sm text-gray-400">
                  Em breve você poderá personalizar suas preferências aqui.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 