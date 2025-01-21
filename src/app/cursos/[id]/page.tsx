'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import CourseDetails from '@/components/CourseDetails'

interface Lesson {
  id: number;
  title: string;
  content: string;
  duration?: string;
  thumbnailUrl?: string;
  order: number;
  videoUrl: string;
  materialUrl?: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  modules: Module[];
}

const API_URL = 'https://cursos-api-cursos.dpbdp1.easypanel.host';

export default function CoursePage({ params }: { params: { id: string } }) {
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isContentExpanded, setIsContentExpanded] = useState(false);

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        const response = await fetch(`${API_URL}/courses/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch course');
        const data = await response.json();
        setCourseData(data);

        // Encontrar a primeira aula do primeiro módulo
        if (data.modules.length > 0) {
          const sortedModules = [...data.modules].sort((a, b) => a.order - b.order);
          const firstModule = sortedModules[0];
          if (firstModule.lessons.length > 0) {
            const sortedLessons = [...firstModule.lessons].sort((a, b) => a.order - b.order);
            setCurrentLesson(sortedLessons[0]);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar curso:', error);
      }
    };

    loadCourseData();
  }, [params.id]);

  if (!courseData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Área do Vídeo e Conteúdo */}
        <div className="lg:col-span-2 space-y-4">
          {currentLesson ? (
            <>
              {/* Vídeo */}
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={currentLesson.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Título */}
              <div className="bg-[#161616] rounded-lg p-6">
                <h2 className="text-xl font-bold text-white">{currentLesson.title}</h2>
              </div>

              {/* Conteúdo - Desktop */}
              <div className="hidden sm:block">
                {currentLesson.content && (
                  <div className="bg-[#161616] rounded-lg p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Conteúdo da Aula</h3>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {currentLesson.content}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Conteúdo - Mobile */}
              <div className="block sm:hidden">
                {currentLesson.content && (
                  <div className="bg-[#161616] rounded-lg overflow-hidden">
                    <button
                      onClick={() => setIsContentExpanded(!isContentExpanded)}
                      className="w-full p-6 flex items-center justify-between text-left"
                    >
                      <h3 className="text-lg font-medium text-white">Conteúdo da Aula</h3>
                      <ChevronDown 
                        className={`h-5 w-5 text-gray-400 transition-transform ${
                          isContentExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    {isContentExpanded && (
                      <div className="px-6 pb-6">
                        <div className="prose prose-invert max-w-none">
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {currentLesson.content}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Material Complementar */}
              {currentLesson.materialUrl && (
                <div className="bg-[#161616] rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Material Complementar</h3>
                  <a 
                    href={currentLesson.materialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Baixar material
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="aspect-video bg-[#161616] rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Carregando aula...</p>
            </div>
          )}
        </div>

        {/* Lista de Módulos e Aulas */}
        <div className="lg:col-span-1">
          <CourseDetails 
            course={courseData} 
            onSelectLesson={(lesson) => setCurrentLesson(lesson)}
            currentLesson={currentLesson}
          />
        </div>
      </div>
    </div>
  );
} 