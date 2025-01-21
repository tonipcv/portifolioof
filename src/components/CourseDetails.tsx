'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Play } from 'lucide-react'
import Image from 'next/image'

interface Lesson {
  id: number
  title: string
  content: string
  duration?: string
  thumbnailUrl?: string
  order: number
  videoUrl: string
  materialUrl?: string
}

interface Module {
  id: string
  title: string
  description: string
  order: number
  lessons: Lesson[]
}

interface Course {
  id: number
  title: string
  description: string
  modules: Module[]
}

interface CourseDetailsProps {
  course: Course
  onSelectLesson: (lesson: Lesson) => void
  currentLesson: Lesson | null
}

export default function CourseDetails({ course, onSelectLesson, currentLesson }: CourseDetailsProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>([])

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    return `${minutes} min`
  }

  return (
    <div className="bg-[#161616] rounded-lg overflow-hidden border border-[#222222]">
      <div className="border-t border-[#222222]">
        {course.modules.sort((a, b) => a.order - b.order).map(module => (
          <div key={module.id} className="border-b border-[#222222] last:border-b-0">
            <div
              className="p-4 cursor-pointer hover:bg-[#222222] transition-colors"
              onClick={() => toggleModule(module.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">{module.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{module.description}</p>
                </div>
                {expandedModules.includes(module.id) ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>

            {expandedModules.includes(module.id) && (
              <div className="bg-[#1a1a1a] p-4 space-y-2">
                {module.lessons.sort((a, b) => a.order - b.order).map(lesson => (
                  <div 
                    key={lesson.id}
                    className={`flex items-center gap-4 py-2 px-4 rounded-lg hover:bg-[#222222] transition-colors cursor-pointer ${
                      currentLesson?.id === lesson.id ? 'bg-blue-500/20' : ''
                    }`}
                    onClick={() => onSelectLesson(lesson)}
                  >
                    {lesson.thumbnailUrl ? (
                      <div className="relative w-24 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={lesson.thumbnailUrl}
                          alt={lesson.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-16 bg-[#222222] rounded-md flex items-center justify-center flex-shrink-0">
                        <Play className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium truncate ${
                        currentLesson?.id === lesson.id ? 'text-blue-400' : 'text-gray-200'
                      }`}>
                        {lesson.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">
                        {lesson.duration}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 