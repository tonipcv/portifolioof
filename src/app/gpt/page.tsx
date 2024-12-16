'use client'

import { useState } from 'react'
import { ChatMessage } from '@/components/Chat/ChatMessage'
import { ChatInput } from '@/components/Chat/ChatInput'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function GPTPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async (content: string) => {
    try {
      setIsLoading(true)
      
      const userMessage = { role: 'user' as const, content }
      setMessages(prev => [...prev, userMessage])

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        throw new Error('Falha ao obter resposta')
      }

      const data = await response.json()
      
      setIsTyping(true)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message
      }])

      setTimeout(() => {
        setIsTyping(false)
      }, data.message.length * 15 + 500)

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Chat com Alex 💬</h1>
      </div>
      <div className="bg-[#1a1a1a] rounded-lg border border-white/10 p-6">
        <div className="h-[60vh] overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">
              <p className="text-lg mb-2">👋 Olá! Eu sou o Alex</p>
              <p className="text-sm">
                Estou aqui para ajudar com suas dúvidas sobre criptomoedas e investimentos.
                Pode me perguntar qualquer coisa!
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage
                key={index}
                role={message.role}
                content={message.content}
                isTyping={isTyping && index === messages.length - 1 && message.role === 'assistant'}
              />
            ))
          )}
        </div>
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  )
} 