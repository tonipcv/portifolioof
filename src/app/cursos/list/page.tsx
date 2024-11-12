'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ClockIcon, BookOpenIcon, PlayIcon } from '@heroicons/react/24/outline';
import { OptimizedImage } from '@/components/OptimizedImage';
import { Navigation } from '@/components/Navigation';

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration?: string;
  lessonsCount?: number;
}

const API_URL = 'https://cursos-api-cursos.dpbdp1.easypanel.host';

export default function CoursesListPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_URL}/courses`);
        if (!response.ok) {
          throw new Error('Erro ao buscar cursos');
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Erro ao carregar cursos:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-[#111] text-gray-200">
      {/* Header */}
      <header className="fixed top-0 w-full bg-[#111]/90 backdrop-blur-sm z-50 px-4 py-3">
        <div className="flex justify-center lg:justify-start">
          <Link href="/" className="flex items-center">
            <OptimizedImage src="/logo.png" alt="Futuros Tech Logo" width={40} height={40} />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-20 container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Cursos Disponíveis</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {courses.map((course) => (
            <Link 
              key={course.id}
              href={`/cursos/${course.id}`}
              className="group relative block bg-black rounded-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:z-10"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video">
                <OptimizedImage
                  src={course.thumbnailUrl || '/default-course-thumb.jpg'}
                  alt={course.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:opacity-40"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="rounded-full bg-white/30 p-4">
                    <PlayIcon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Course Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                  <h2 className="text-lg font-bold text-white mb-1 line-clamp-1">{course.title}</h2>
                  <p className="text-sm text-gray-300 line-clamp-2 mb-2">{course.description}</p>
                  
                  {/* Course Meta */}
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    {course.duration && (
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        {course.duration}
                      </span>
                    )}
                    {course.lessonsCount && (
                      <span className="flex items-center gap-1">
                        <BookOpenIcon className="w-3 h-3" />
                        {course.lessonsCount} aulas
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
} 