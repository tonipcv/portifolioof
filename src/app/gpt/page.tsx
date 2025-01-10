'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState, FormEvent, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function GPTPage() {
  const { data: session, status } = useSession()
  const isPremium = session?.user?.subscriptionStatus === 'premium'
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session || !isPremium) {
    redirect('/blocked')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    setInput('')
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      setMessages(prev => [...prev, data])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Cryph AI 💬</h1>
      </div>
      <div className="bg-black/20 backdrop-blur-md rounded-xl border border-white/10 p-6 flex flex-col h-[80vh]">
        <div className="flex-1 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarImage src="/alex-avatar.png" />
                <AvatarFallback className="bg-[#0099ff]/80 text-white">AI</AvatarFallback>
              </Avatar>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 max-w-[80%] border border-white/10">
                <p className="text-white">
                  👋 Olá! Eu sou o Alex, seu assistente especialista em criptomoedas e investimentos.
                  Como posso ajudar você hoje?
                </p>
              </div>
            </div>

            {messages.map((message, index) => (
              <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <Avatar className="h-8 w-8 mt-1">
                  {message.role === 'user' ? (
                    <>
                      <AvatarImage src={session.user?.image || ''} />
                      <AvatarFallback className="bg-zinc-800 text-white">
                        {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="/alex-avatar.png" />
                      <AvatarFallback className="bg-[#0099ff]/80 text-white">AI</AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div className={`rounded-xl p-4 max-w-[80%] backdrop-blur-sm border border-white/10 ${
                  message.role === 'user' 
                    ? 'bg-[#0099ff]/10' 
                    : 'bg-white/5'
                }`}>
                  <p className="text-white" dangerouslySetInnerHTML={{ __html: message.content }} />
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src="/alex-avatar.png" />
                  <AvatarFallback className="bg-[#0099ff]/80 text-white">AI</AvatarFallback>
                </Avatar>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-[#0099ff] rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-[#0099ff] rounded-full animate-pulse delay-150"></div>
                    <div className="w-1.5 h-1.5 bg-[#0099ff] rounded-full animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-white/5 backdrop-blur-sm text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#0099ff]/50 border border-white/10"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-[#0099ff] text-white p-3 rounded-xl hover:bg-[#0099ff]/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  )
} 