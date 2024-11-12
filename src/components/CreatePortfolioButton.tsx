'use client';

import { useState } from 'react';
import { CreatePortfolioModal } from './CreatePortfolioModal';

export function CreatePortfolioButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-transparent border-2 border-white text-white px-4 py-2 rounded-lg transition-colors hover:bg-white/10"
      >
        Criar Portfolio
      </button>

      <CreatePortfolioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
} 