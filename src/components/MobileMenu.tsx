'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Briefcase, GraduationCap, Menu, X } from 'lucide-react'

interface MobileMenuProps {
  session: any
}

export function MobileMenu({ session }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-white transition-colors"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#161616] border-b border-[#222222]">
          <div className="px-4 py-2 space-y-1">
            <Link 
              href="/portfolios"
              className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-[#222222] rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Briefcase className="w-4 h-4" />
              <span className="text-sm font-medium">Portfólio</span>
            </Link>
            <Link 
              href="/cursos/4"
              className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-[#222222] rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <GraduationCap className="w-4 h-4" />
              <span className="text-sm font-medium">Academy</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
} 