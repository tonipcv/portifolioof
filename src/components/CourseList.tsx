'use client'

import { Course, Module } from '@/types/course'
import { useState } from 'react'
import Image from 'next/image'
import { ChevronDown, ChevronUp, Play } from 'lucide-react'

interface CourseListProps {
  courses: Course[]
}

export default function CourseList({ courses }: CourseListProps) {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
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
    <div className="space-y-6">
      {courses.map(course => (
        <div 
          key={course.id} 
          className="bg-[#161616] rounded-lg overflow-hidden border border-[#222222]"
        >
          <div 
            className="p-6 cursor-pointer"
            onClick={() => setSelectedCourse(selectedCourse === course.id ? null : course.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <div>
                  <h2 className="text-xl font-semibold text-white">{course.title}</h2>
                  <p className="text-gray-400 mt-1">{course.description}</p>
                </div>
              </div>
              {selectedCourse === course.id ? (
                <ChevronUp className="h-6 w-6 text-gray-400" />
              ) : (
                <ChevronDown className="h-6 w-6 text-gray-400" />
              )}
            </div>
          </div>

          {selectedCourse === course.id && (
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
                    <div className="bg-[#1a1a1a] p-4">
                      {module.lessons.sort((a, b) => a.order - b.order).map(lesson => (
                        <div 
                          key={lesson.id}
                          className="flex items-center justify-between py-2 px-4 rounded-lg hover:bg-[#222222] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <Play className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-200">{lesson.title}</span>
                          </div>
                          <span className="text-sm text-gray-400">
                            {formatDuration(lesson.duration)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
} 