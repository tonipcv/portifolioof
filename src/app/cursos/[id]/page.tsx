'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CourseDetails from '@/components/CourseDetails'

interface Lesson {
  id: number;
  title: string;
  description: string;
  duration?: string;
  thumbnailUrl?: string;
  order: number;
  videoUrl: string;
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
        {/* Área do Vídeo */}
        <div className="lg:col-span-2">
          {currentLesson ? (
            <div className="space-y-4">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={currentLesson.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6 bg-[#161616] rounded-lg space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{currentLesson.title}</h2>
                  <p className="text-sm text-gray-400 mt-1">Duração: {currentLesson.duration}</p>
                </div>
                {currentLesson.description && (
                  <div className="pt-4 border-t border-[#222222]">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {currentLesson.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
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