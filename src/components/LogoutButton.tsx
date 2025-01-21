"use client"

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import * as Dialog from '@radix-ui/react-dialog'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
          title="Sair"
        >
          <LogOut className="h-5 w-5 text-zinc-400" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-md rounded-lg bg-zinc-900 border border-zinc-800 p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold text-zinc-100">
            Deseja realmente sair?
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-zinc-400">
            Você precisará fazer login novamente para acessar seus portfolios.
          </Dialog.Description>

          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 text-sm font-medium text-white bg-red-900 hover:bg-red-800 rounded-md transition-colors"
            >
              Sair
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}