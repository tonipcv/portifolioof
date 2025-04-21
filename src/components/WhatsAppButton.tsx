import { MessageCircle } from 'lucide-react'

export function WhatsAppButton() {
  const phoneNumber = '5511976638147'
  const whatsappUrl = `https://wa.me/${phoneNumber}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 md:bottom-8 md:right-8 bg-zinc-800 hover:bg-zinc-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
      title="Fale conosco no WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  )
} 