'use client'

import Link from 'next/link'
import { useState } from 'react'
import { BookOpen, BookOpenCheck, TrendingUp, ShieldCheck } from 'lucide-react'
import { OptimizedImage } from '@/components/OptimizedImage'

interface Course {
  id: number
  title: string
  description: string
  duration: string
  thumbnail: string
  lessons: number
  category: string
}

export default function CoursesPage() {
  const [activeCourse, setActiveCourse] = useState<number | null>(null)

  const courses: Course[] = [
    {
      id: 1,
      title: "Fundamentos do Trading",
      description: "Aprenda os conceitos básicos e essenciais para começar a operar no mercado de criptomoedas",
      duration: "2h 30min",
      thumbnail: "/course-trading.jpg",
      lessons: 8,
      category: "Iniciante"
    },
    {
      id: 2,
      title: "Análise Técnica Avançada",
      description: "Domine as principais ferramentas e indicadores para análise de mercado",
      duration: "3h 45min",
      thumbnail: "/course-analysis.jpg",
      lessons: 12,
      category: "Avançado"
    },
    {
      id: 3,
      title: "Gestão de Risco e Capital",
      description: "Aprenda a proteger seu capital e gerenciar riscos de forma profissional",
      duration: "2h 15min",
      thumbnail: "/course-risk.jpg",
      lessons: 6,
      category: "Intermediário"
    }
  ]

  return (
    <div className="min-h-screen bg-[#111] text-gray-200">
      {/* Main Content */}
      <main className="pt-14 pb-20">
        {/* Hero Section */}
        <div className="relative bg-[#111] h-48 md:h-32 lg:h-32 flex items-center">
          <div className="w-full md:w-1/2 lg:w-1/2 md:mx-auto lg:mx-auto">
            <div className="px-6 py-8 md:py-4 lg:py-4">
              <h1 className="text-2xl font-bold mb-3 md:mb-1 lg:mb-1">Academy</h1>
              <p className="text-sm text-gray-300">Aprenda com nossos cursos especializados em trading e investimentos</p>
            </div>
          </div>
        </div>

        {/* Courses List and Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 md:w-1/2 lg:w-1/2 md:mx-auto lg:mx-auto gap-0">
          {/* Courses List */}
          <div className="md:h-[calc(100vh-11rem)] lg:h-[calc(100vh-11rem)] md:overflow-y-auto lg:overflow-y-auto px-4 pb-2 md:p-4 lg:p-4">
            <h2 className="text-lg font-bold mb-2 lg:mb-3">Cursos Disponíveis</h2>
            <div className="space-y-1 lg:space-y-2">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => setActiveCourse(course.id)}
                  className={`w-full flex gap-2 lg:gap-3 p-2 rounded-lg transition-colors ${
                    activeCourse === course.id ? 'bg-gray-400/30 border-l-4 border-[#0099ff]' : 'hover:bg-gray-800'
                  }`}
                >
                  <div className="relative w-24 aspect-video">
                    <div className="w-full h-full bg-gray-800 rounded flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-[#0099ff]" />
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-[#0099ff] text-sm">{course.category}</h3>
                    <p className="text-xs text-gray-200">{course.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{course.duration} • {course.lessons} aulas</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content and Materials */}
          <div className="space-y-3 md:space-y-4 lg:space-y-4 px-4 md:p-4 lg:p-4">
            <section className="bg-gray-900/50 backdrop-blur-sm p-3 lg:p-4 rounded-lg">
              <h2 className="text-lg font-bold mb-3">Comece sua jornada:</h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Nossa Academy oferece cursos completos para você dominar o mercado de criptomoedas, desde o básico até estratégias avançadas.
              </p>
              <div className="mt-3 p-3 bg-[#0099ff]/10 border border-[#0099ff]/30 rounded-lg">
                <p className="text-xs text-[#0099ff]">
                  Conteúdo exclusivo para assinantes premium.
                </p>
              </div>
            </section>

            <section className="bg-gray-900/50 p-4 rounded-lg">
              <h2 className="text-lg font-bold mb-3">Recursos Inclusos</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <BookOpenCheck className="w-4 h-4 text-[#0099ff]" />
                  <span>Material complementar em PDF</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <TrendingUp className="w-4 h-4 text-[#0099ff]" />
                  <span>Exercícios práticos</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <ShieldCheck className="w-4 h-4 text-[#0099ff]" />
                  <span>Certificado de conclusão</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
