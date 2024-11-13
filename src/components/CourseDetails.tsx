'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Play } from 'lucide-react'
import Image from 'next/image'

interface Lesson {
  id: number
  title: string
  description: string
  duration?: string
  thumbnailUrl?: string
  order: number
  videoUrl: string
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
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null)

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const toggleLesson = (lessonId: number) => {
    setExpandedLesson(prev => prev === lessonId ? null : lessonId)
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    return `${minutes} min`
  }

  return (
    <div className="bg-[#161616] rounded-lg overflow-hidden border border-[#222222]">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white mb-4">{course.title}</h1>
        <p className="text-gray-400">{course.description}</p>
      </div>

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
                  <div key={lesson.id}>
                    <div 
                      className={`flex items-center justify-between py-2 px-4 rounded-lg hover:bg-[#222222] transition-colors cursor-pointer ${
                        currentLesson?.id === lesson.id ? 'bg-blue-500/20' : ''
                      }`}
                      onClick={() => {
                        onSelectLesson(lesson)
                        toggleLesson(lesson.id)
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <Play className={`h-4 w-4 ${
                          currentLesson?.id === lesson.id ? 'text-blue-400' : 'text-gray-400'
                        }`} />
                        <span className={`${
                          currentLesson?.id === lesson.id ? 'text-blue-400' : 'text-gray-200'
                        }`}>
                          {lesson.title}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {lesson.duration}
                      </span>
                    </div>

                    {expandedLesson === lesson.id && (
                      <div className="mt-2 ml-11 space-y-2">
                        {lesson.thumbnailUrl && (
                          <div className="relative aspect-video rounded-lg overflow-hidden">
                            <Image
                              src={lesson.thumbnailUrl}
                              alt={lesson.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        {lesson.description && (
                          <p className="text-sm text-gray-400 py-2">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                    )}
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