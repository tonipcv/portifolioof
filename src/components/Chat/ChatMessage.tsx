'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

type MessageProps = {
  content: string
  role: 'user' | 'assistant'
  isTyping?: boolean
}

export function ChatMessage({ content, role, isTyping = false }: MessageProps) {
  const { data: session } = useSession()
  const [displayContent, setDisplayContent] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (role === 'assistant' && isTyping) {
      const timer = setTimeout(() => {
        if (currentIndex < content.length) {
          setDisplayContent(content.slice(0, currentIndex + 1))
          setCurrentIndex(currentIndex + 1)
        }
      }, 15) // Velocidade da digitação

      return () => clearTimeout(timer)
    } else {
      setDisplayContent(content)
    }
  }, [content, currentIndex, role, isTyping])

  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      {role === 'assistant' && (
        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center mr-2">
          <span className="text-white text-sm font-bold">A</span>
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          role === 'user'
            ? 'bg-green-900/20 border border-green-100/20'
            : 'bg-[#1a1a1a] border border-white/10'
        }`}
      >
        <div 
          className="text-sm text-gray-200 whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: displayContent }}
        />
      </div>
      {role === 'user' && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center ml-2">
          <span className="text-white text-sm font-bold">
            {session?.user?.name?.[0].toUpperCase() || 'U'}
          </span>
        </div>
      )}
    </div>
  )
} 