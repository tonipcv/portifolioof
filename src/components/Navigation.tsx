'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { ConfirmExitModal } from './ui/confirm-exit-modal'

export function Navigation() {
  const [showExitModal, setShowExitModal] = useState(false)

  const handleExitClick = () => {
    setShowExitModal(true)
  }

  const handleConfirmExit = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <>
      {/* Seu código de navegação existente */}
      <button
        onClick={handleExitClick}
        className="your-existing-classes"
      >
        {/* Seu ícone de sair */}
      </button>

      <ConfirmExitModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirm={handleConfirmExit}
      />
    </>
  )
} 