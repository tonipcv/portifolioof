'use client'

interface ConfirmExitModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ConfirmExitModal({ isOpen, onClose, onConfirm }: ConfirmExitModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#161616] rounded-lg p-6 w-full max-w-sm mx-4 shadow-xl">
        <h3 className="text-lg font-medium text-gray-200 mb-4">
          Confirmar Saída
        </h3>
        
        <p className="text-gray-400 mb-6">
          Tem certeza que deseja sair do aplicativo?
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  )
} 