'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Lock, Play, FileText, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface Lesson {
  id: number;
  moduleId: number;
  title: string;
  content: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  materialUrl: string | null;
  order: number;
}

interface Module {
  id: number;
  courseId: number;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  coverUrl: string | null;
  order: number;
  lessons: Lesson[];
  createdAt: string;
  updatedAt: string;
}

interface Course {
  id: number;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  coverUrl: string | null;
  modules: Module[];
  createdAt: string;
  updatedAt: string;
  isPro: boolean;
}

export default function CoursesPage() {
  const { data: session, status } = useSession()
  const isPremium = session?.user?.subscriptionStatus === 'premium'
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetchCourses();
    }
  }, [session]);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://cursos-api-cursos.dpbdp1.easypanel.host/courses');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // Filter to show only ARS course
      const arsCourse = data.filter((course: Course) => course.title.toLowerCase().includes('ars'));
      setCourses(arsCourse);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewCourse = async (courseId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://cursos-api-cursos.dpbdp1.easypanel.host/courses/${courseId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const course = await response.json();
      setSelectedCourse(course);
    } catch (error) {
      console.error('Error fetching course details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLessonClick = async (lesson: Lesson) => {
    if (!isPremium) return;
    
    setSelectedLesson(lesson); // Set immediately for better UX
    setIsLoading(true);
    
    try {
      const response = await fetch(`https://cursos-api-cursos.dpbdp1.easypanel.host/lessons/${lesson.id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const lessonData = await response.json();
      
      // Ensure we have all the data
      if (lessonData) {
        setSelectedLesson({
          id: lesson.id,
          moduleId: lesson.moduleId,
          title: lessonData.title || lesson.title,
          content: lessonData.content || lesson.content,
          videoUrl: lessonData.videoUrl || lesson.videoUrl,
          thumbnailUrl: lessonData.thumbnailUrl || lesson.thumbnailUrl,
          materialUrl: lessonData.materialUrl || lesson.materialUrl,
          order: lesson.order
        });
      }
    } catch (error) {
      console.error('Error fetching lesson details:', error);
      // Keep the initial lesson data if there's an error
      setSelectedLesson(lesson);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="fixed inset-x-0 top-16 bottom-16 md:ml-64 bg-[#121214]">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-4 md:px-6 pt-4 md:pt-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-xl text-white">Cursos</h1>
              <span className="bg-[#0099ff]/20 text-[#0099ff] text-[8px] px-1.5 py-0.5 rounded-full border border-[#0099ff]/20">
                BETA
              </span>
            </div>
            <button
              onClick={fetchCourses}
              disabled={isLoading}
              className="p-2 text-white hover:text-[#0099ff] focus:outline-none transition-colors duration-200"
              title="Atualizar cursos"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0099ff]"></div>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
            </button>
          </div>

          {isLoading && courses.length === 0 ? (
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0099ff]"></div>
            </div>
          ) : courses.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="relative bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/5 hover:border-white/10 transition-all duration-300">
                    {!isPremium && course.isPro && (
                      <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                        <div className="text-center px-4">
                          <Lock className="w-8 h-8 text-[#0099ff] mx-auto mb-2" />
                          <p className="text-sm text-gray-300">Disponível apenas para assinantes</p>
                          <Link 
                            href="/pricing" 
                            className="mt-3 inline-block text-xs bg-[#0099ff]/10 text-[#0099ff] hover:bg-[#0099ff]/20 px-4 py-2 rounded-full transition-all duration-300"
                          >
                            Assinar agora
                          </Link>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start justify-between">
                      <h2 className="text-base md:text-lg font-medium text-white line-clamp-2">{course.title}</h2>
                      {course.isPro && (
                        <span className="bg-[#0099ff]/20 text-[#0099ff] text-[10px] px-2 py-1 rounded-full border border-[#0099ff]/20 ml-2 shrink-0">
                          PRO
                        </span>
                      )}
                    </div>

                    {course.thumbnailUrl && (
                      <div className="relative w-full h-40 mt-4 rounded-xl overflow-hidden">
                        <Image
                          src={course.thumbnailUrl}
                          alt={course.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          priority={false}
                        />
                      </div>
                    )}

                    <p className="text-sm text-gray-400 mt-4 line-clamp-3">{course.description}</p>

                    <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                      <div className="text-xs text-gray-500">
                        {course.modules?.length || 0} módulos
                      </div>
                      <button 
                        onClick={() => handleViewCourse(course.id)}
                        className="text-xs bg-[#0099ff]/10 text-[#0099ff] hover:bg-[#0099ff]/20 px-4 py-2 rounded-full transition-all duration-300"
                        disabled={!isPremium && course.isPro}
                      >
                        Ver curso
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-gray-400">
              <p>Nenhum curso encontrado</p>
              <button
                onClick={fetchCourses}
                className="mt-2 text-sm text-[#0099ff] hover:text-[#0099ff]/80"
              >
                Tentar novamente
              </button>
            </div>
          )}
        </div>

        {selectedCourse && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border border-white/10">
              <div className="p-4 md:p-8">
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-lg md:text-xl font-medium text-white">{selectedCourse.title}</h2>
                  <button
                    onClick={() => {
                      setSelectedCourse(null);
                      setSelectedLesson(null);
                    }}
                    className="text-gray-500 hover:text-white transition-colors p-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {selectedLesson ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-medium">{selectedLesson.title}</h3>
                      <div className="flex items-center gap-4">
                        <Link
                          href="/gpt"
                          className="text-[#0099ff] hover:text-[#0099ff]/80 flex items-center gap-2 text-sm"
                        >
                          <HelpCircle className="w-4 h-4" />
                          Suporte
                        </Link>
                        {selectedLesson.materialUrl && (
                          <a
                            href={selectedLesson.materialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0099ff] hover:text-[#0099ff]/80 flex items-center gap-2 text-sm"
                          >
                            <FileText className="w-4 h-4" />
                            Material complementar
                          </a>
                        )}
                        <button
                          onClick={() => setSelectedLesson(null)}
                          className="text-gray-500 hover:text-white text-sm"
                        >
                          Voltar para módulos
                        </button>
                      </div>
                    </div>
                    
                    {isLoading ? (
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-800 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0099ff]"></div>
                      </div>
                    ) : selectedLesson.videoUrl ? (
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-800">
                        <iframe
                          src={selectedLesson.videoUrl.includes('youtube.com') 
                            ? selectedLesson.videoUrl.replace('watch?v=', 'embed/') 
                            : selectedLesson.videoUrl.includes('vimeo.com')
                            ? selectedLesson.videoUrl.replace('vimeo.com', 'player.vimeo.com/video')
                            : selectedLesson.videoUrl
                          }
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                    ) : selectedLesson.thumbnailUrl ? (
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-800">
                        <Image
                          src={selectedLesson.thumbnailUrl}
                          alt={selectedLesson.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-800 flex items-center justify-center">
                        <p className="text-gray-400">Nenhum vídeo ou imagem disponível</p>
                      </div>
                    )}

                    <div className="prose prose-invert max-w-none space-y-4">
                      {selectedLesson.content ? (
                        <div className="text-gray-400 text-sm md:text-base leading-relaxed">
                          {selectedLesson.content.split('\n').map((section, index) => {
                            const cleanSection = section.trim();
                            if (!cleanSection) return null;

                            if (cleanSection.startsWith('#')) {
                              return (
                                <h4 key={index} className="text-white font-medium text-lg mt-8 mb-4">
                                  {cleanSection.replace('#', '').trim()}
                                </h4>
                              );
                            }

                            if (/^\d+\./.test(cleanSection)) {
                              const [number, ...rest] = cleanSection.split('.');
                              return (
                                <div key={index} className="flex gap-2 mt-4 mb-2">
                                  <span className="text-[#0099ff] font-medium">{number}.</span>
                                  <span className="text-gray-300">{rest.join('.').trim()}</span>
                                </div>
                              );
                            }

                            return (
                              <p key={index} className="text-gray-300 my-4">
                                {cleanSection}
                              </p>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-gray-400 text-sm text-center">
                          Nenhum conteúdo disponível para esta aula.
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    {selectedCourse.thumbnailUrl && (
                      <div className="relative w-full h-64 md:h-80 mb-6 rounded-xl overflow-hidden">
                        <Image
                          src={selectedCourse.thumbnailUrl}
                          alt={selectedCourse.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="prose prose-invert max-w-none">
                      <div className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
                        {selectedCourse.description}
                      </div>

                      <div className="space-y-6">
                        {selectedCourse.modules?.map((module, moduleIndex) => (
                          <div key={module.id} className="bg-zinc-800/30 rounded-xl p-4">
                            <h3 className="text-white font-medium text-lg mb-4">
                              Módulo {moduleIndex + 1}: {module.title}
                            </h3>
                            <p className="text-gray-400 text-sm mb-4">{module.description}</p>
                            
                            <div className="space-y-2">
                              {module.lessons?.map((lesson, lessonIndex) => (
                                <button 
                                  key={lesson.id}
                                  onClick={() => handleLessonClick(lesson)}
                                  disabled={!isPremium}
                                  className="w-full text-left flex items-center justify-between bg-zinc-900/50 rounded-lg p-3 hover:bg-zinc-900/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-[#0099ff] font-medium">{lessonIndex + 1}.</span>
                                    <span className="text-gray-300">{lesson.title}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {lesson.videoUrl && (
                                      <Play className="w-4 h-4 text-[#0099ff]" />
                                    )}
                                    {lesson.materialUrl && (
                                      <FileText className="w-4 h-4 text-[#0099ff]" />
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 