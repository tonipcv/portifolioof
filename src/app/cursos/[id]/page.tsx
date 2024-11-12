'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { DocumentArrowDownIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { OptimizedImage } from '@/components/OptimizedImage';
import { Navigation } from '@/components/Navigation';
import { PandaPlayer } from '@/components/PandaPlayer';

interface Lesson {
  id: number;
  title: string;
  duration?: string;
  thumbnailUrl?: string;
  order: number;
  videoUrl: string;
}

interface Module {
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  modules: Module[];
}

interface Episode {
  id: number;
  title: string;
  duration: string;
  thumbnail: string;
  number: number;
  videoId: string;
}

const API_URL = 'https://cursos-api-cursos.dpbdp1.easypanel.host';

async function fetchCourseWithEpisodes(courseId: number): Promise<Course> {
  const response = await fetch(`${API_URL}/courses/${courseId}`);
  if (!response.ok) {
    throw new Error('Erro ao buscar curso');
  }
  const data = await response.json();
  return data;
}

export default function CoursePage({ params }: { params: { id: string } }) {
  const [activeEpisode, setActiveEpisode] = useState<number | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        const data = await fetchCourseWithEpisodes(parseInt(params.id));
        setCourse(data);

        const allEpisodes = data.modules.flatMap((module) =>
          module.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            duration: lesson.duration || 'N/A',
            thumbnail: lesson.thumbnailUrl || '/default-thumb.jpg',
            number: lesson.order,
            videoId: lesson.videoUrl
          }))
        );
        setEpisodes(allEpisodes);
      } catch (error) {
        console.error('Erro ao buscar dados do curso:', error);
      }
    };
    loadCourseData();
  }, [params.id]);

  const currentEpisode = episodes.find((ep) => ep.id === activeEpisode);

  return (
    <div className="min-h-screen bg-[#111] text-gray-200">
      {/* Header */}
      <header className="fixed top-0 w-full bg-[#111]/90 backdrop-blur-sm z-50 px-4 py-3">
        <div className="flex justify-center lg:justify-start">
          <Link href="/cursos/list" className="flex items-center">
            <OptimizedImage src="/ft-icone.png" alt="Futuros Tech Logo" width={40} height={40} />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-14 pb-20">
        {/* Hero Section */}
        {!activeEpisode && course && (
          <div className="relative bg-[#111] h-48 md:h-32 lg:h-32 flex items-center">
            <div className="w-full md:w-1/2 lg:w-1/2 md:mx-auto lg:mx-auto">
              <div className="px-6 py-8 md:py-4 lg:py-4">
                <h1 className="text-2xl font-bold mb-3 md:mb-1 lg:mb-1">{course.title}</h1>
                <p className="text-sm text-gray-300">{course.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Video Player Section */}
        {activeEpisode && currentEpisode && (
          <div>
            <div className="w-full md:w-1/2 lg:w-1/2 md:mx-auto lg:mx-auto bg-black">
              <PandaPlayer videoId={currentEpisode.videoId} />
            </div>
            <div className="px-6 py-4 bg-[#111] md:w-1/2 lg:w-1/2 md:mx-auto lg:mx-auto">
              <h2 className="text-xl font-bold">{currentEpisode.title}</h2>
            </div>
          </div>
        )}

        {/* Episodes List and Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 md:w-1/2 lg:w-1/2 md:mx-auto lg:mx-auto gap-0">
          {/* Episodes List */}
          <div className="md:h-[calc(100vh-11rem)] lg:h-[calc(100vh-11rem)] md:overflow-y-auto lg:overflow-y-auto px-4 pb-2 md:p-4 lg:p-4">
            <h2 className="text-lg font-bold mb-2 lg:mb-3">Episódios</h2>
            <div className="space-y-1 lg:space-y-2">
              {episodes.map((episode) => (
                <button
                  key={episode.id}
                  onClick={() => setActiveEpisode(episode.id)}
                  className={`w-full flex gap-2 lg:gap-3 p-2 rounded-lg transition-colors ${
                    activeEpisode === episode.id 
                      ? 'bg-gray-400/30 border-l-4 border-green-300' 
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <div className="relative w-24 aspect-video">
                    <OptimizedImage
                      src={episode.thumbnail}
                      alt={episode.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-green-300 text-sm">Aula {episode.number}</h3>
                    <p className="text-xs text-gray-200">{episode.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{episode.duration}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content and Materials */}
          <div className="space-y-3 md:space-y-4 lg:space-y-4 px-4 md:p-4 lg:p-4">
            <section className="bg-gray-900/50 backdrop-blur-sm p-3 lg:p-4 rounded-lg">
              <h2 className="text-lg font-bold mb-3">Assista o curso:</h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                A tecnologia é a melhor ferramenta hoje para operar, mas sem saber como usar você não terá o aproveitamento máximo.
              </p>
              <div className="mt-3 p-3 bg-green-900/20 border border-green-700/50 rounded-lg">
                <p className="text-xs text-green-200">
                  Este conteúdo tem caráter informativo e educacional.
                </p>
              </div>
            </section>

            <section className="bg-gray-900/50 p-4 rounded-lg">
              <h2 className="text-lg font-bold mb-3">Materiais Complementares</h2>
              <div className="space-y-1">
                <a 
                  href="https://drive.google.com/file/d/16oKFw6kYwHmletBjo2eZlBQ4y6bPQkg8/view?usp=drivesdk" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-sm flex items-center gap-2"
                >
                  <BookOpenIcon className="w-4 h-4" />
                  Black Book
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Navigation />
    </div>
  );
} 