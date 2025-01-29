'use client'

import React, { useState, FormEvent, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Send } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

declare module 'next-auth' {
  interface Session {
    user?: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
      subscriptionStatus?: string
    }
  }
}

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
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Carregar mensagens da conversa atual
  const loadMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  // Carregar última conversa ao iniciar
  useEffect(() => {
    const loadLastConversation = async () => {
      try {
        const response = await fetch('/api/conversations')
        if (response.ok) {
          const conversations = await response.json()
          if (conversations.length > 0) {
            const lastConversation = conversations[0]
            setCurrentConversationId(lastConversation.id)
            await loadMessages(lastConversation.id)
          }
        }
      } catch (error) {
        console.error('Error loading conversations:', error)
      }
    }

    if (session?.user) {
      loadLastConversation()
    }
  }, [session])

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
          messages: [...messages, userMessage],
          conversationId: currentConversationId
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      setMessages(prev => [...prev, data])
      setCurrentConversationId(data.conversationId)
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-x-0 top-16 bottom-16 md:ml-64">
      <div className="flex flex-col h-full bg-zinc-900">
        <div className="flex-1 overflow-y-auto px-2 md:px-6 pt-2 md:pt-6 space-y-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
              <AvatarImage src="/alex-avatar.png" />
              <AvatarFallback className="bg-[#0099ff]/80 text-white text-sm">AI</AvatarFallback>
            </Avatar>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 max-w-[85%] border border-white/10">
              <p className="text-white text-xs md:text-sm">
                👋 Olá{session.user?.name ? `, ${session.user.name}` : ''}! Eu sou o Alex, seu assistente especialista em criptomoedas e investimentos.
                Como posso ajudar você hoje?
              </p>
            </div>
          </div>

          {messages.map((message, index) => (
            <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                {message.role === 'user' ? (
                  <>
                    <AvatarImage src={session.user?.image || ''} />
                    <AvatarFallback className="bg-zinc-800 text-white text-sm">
                      {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </>
                ) : (
                  <>
                    <AvatarImage src="/alex-avatar.png" />
                    <AvatarFallback className="bg-[#0099ff]/80 text-white text-sm">AI</AvatarFallback>
                  </>
                )}
              </Avatar>
              <div className={`rounded-xl p-4 max-w-[85%] backdrop-blur-sm border border-white/10 ${
                message.role === 'user' 
                  ? 'bg-[#0099ff]/10' 
                  : 'bg-white/5'
              }`}>
                <p className="text-white text-sm" dangerouslySetInnerHTML={{ __html: message.content }} />
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                <AvatarImage src="/alex-avatar.png" />
                <AvatarFallback className="bg-[#0099ff]/80 text-white text-sm">AI</AvatarFallback>
              </Avatar>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-[#0099ff] rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-[#0099ff] rounded-full animate-pulse delay-150"></div>
                  <div className="w-1.5 h-1.5 bg-[#0099ff] rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-6 py-4 border-t border-white/10 bg-zinc-900">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-white/5 backdrop-blur-sm text-white text-xs md:text-sm rounded-xl px-2 md:px-4 py-2 md:py-3 focus:outline-none focus:ring-1 focus:ring-[#0099ff]/50 border border-white/10"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-[#0099ff] text-white p-2 md:p-3 rounded-xl hover:bg-[#0099ff]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 