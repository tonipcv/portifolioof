'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Send, Lock } from 'lucide-react';
import Link from 'next/link';

interface News {
  id: number;
  title: string;
  summary: string;
  content: string;
  image?: string;
  video?: string;
  publishedAt: string;
  isPro: boolean;
}

export default function NewsPage() {
  const { data: session, status } = useSession()
  const isPremium = session?.user?.subscriptionStatus === 'premium'
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    if (session?.user) {
      fetchNews();
    }
  }, [session]);

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://adm-news.vercel.app/api/v1/news');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        setNews(result.data);
      } else {
        console.error('Formato de dados inválido:', result);
        setNews([]);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = news.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(news.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handleReadMore = async (news: News) => {
    setSelectedNews(news);
    setIsLoading(true);
    
    try {
      const response = await fetch(`https://adm-news.vercel.app/api/v1/news/${news.id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      
      if (result.success && result.data) {
        setSelectedNews({
          ...news,
          title: result.data.title || news.title,
          summary: result.data.summary || news.summary,
          content: result.data.content || news.content,
          image: result.data.image || news.image,
          video: result.data.video || news.video,
          publishedAt: result.data.publishedAt || news.publishedAt,
          isPro: result.data.isPro || news.isPro
        });
      }
    } catch (error) {
      console.error('Error fetching full news:', error);
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
              <h1 className="text-xl text-white">Relatórios</h1>
              <span className="bg-[#0099ff]/20 text-[#0099ff] text-[8px] px-1.5 py-0.5 rounded-full border border-[#0099ff]/20">
                BETA
              </span>
            </div>
            <button
              onClick={fetchNews}
              disabled={isLoading}
              className="p-2 text-white hover:text-[#0099ff] focus:outline-none transition-colors duration-200"
              title="Atualizar relatórios"
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

          {isLoading && news.length === 0 ? (
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0099ff]"></div>
            </div>
          ) : news.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentItems.map((item) => (
                  <div key={item.id} className="relative bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/5 hover:border-white/10 transition-all duration-300">
                    {!isPremium && (
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
                      <h2 className="text-base md:text-lg font-medium text-white line-clamp-2">{item.title}</h2>
                      {item.isPro && (
                        <span className="bg-[#0099ff]/20 text-[#0099ff] text-[10px] px-2 py-1 rounded-full border border-[#0099ff]/20 ml-2 shrink-0">
                          PRO
                        </span>
                      )}
                    </div>

                    {item.image && (
                      <div className="relative w-full h-40 mt-4 rounded-xl overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          priority={false}
                        />
                      </div>
                    )}

                    <p className="text-sm text-gray-400 mt-4 line-clamp-3">{item.summary}</p>

                    {item.video && (
                      <div className="mt-4">
                        <video 
                          src={item.video} 
                          controls 
                          className="w-full rounded-xl"
                          poster={item.image}
                        />
                      </div>
                    )}

                    <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                      <p className="text-xs text-gray-500">
                        {formatDate(item.publishedAt)}
                      </p>
                      <button 
                        onClick={() => handleReadMore(item)}
                        className="text-xs bg-[#0099ff]/10 text-[#0099ff] hover:bg-[#0099ff]/20 px-4 py-2 rounded-full transition-all duration-300"
                        disabled={!isPremium}
                      >
                        Ler mais
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-2 py-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-full bg-zinc-900/50 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800/50 transition-all duration-300"
                >
                  Anterior
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      currentPage === pageNumber
                        ? 'bg-[#0099ff]/20 text-[#0099ff] border border-[#0099ff]/20'
                        : 'bg-zinc-900/50 text-white hover:bg-zinc-800/50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-full bg-zinc-900/50 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800/50 transition-all duration-300"
                >
                  Próxima
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-gray-400">
              <p>Nenhum relatório encontrado</p>
              <button
                onClick={fetchNews}
                className="mt-2 text-sm text-[#0099ff] hover:text-[#0099ff]/80"
              >
                Tentar novamente
              </button>
            </div>
          )}
        </div>

        {selectedNews && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border border-white/10">
              <div className="p-4 md:p-8">
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-lg md:text-xl font-medium text-white">{selectedNews.title}</h2>
                  <button
                    onClick={() => setSelectedNews(null)}
                    className="text-gray-500 hover:text-white transition-colors p-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {selectedNews.image && (
                  <div className="relative w-full h-64 md:h-80 mb-6 rounded-xl overflow-hidden">
                    <Image
                      src={selectedNews.image}
                      alt={selectedNews.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="prose prose-invert max-w-none">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0099ff]"></div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-gray-400 text-sm md:text-base leading-relaxed">
                        {selectedNews.summary}
                      </div>

                      {selectedNews.content && (
                        <div className="mt-6">
                          {selectedNews.content.split('\n\n').map((section, index) => {
                            const cleanSection = section.trim();
                            if (!cleanSection) return null;

                            if (cleanSection.startsWith('#')) {
                              return (
                                <h3 key={index} className="text-white font-medium text-lg mt-8 mb-4">
                                  {cleanSection.replace('#', '').trim()}
                                </h3>
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
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6 text-xs text-gray-500">
                  {formatDate(selectedNews.publishedAt)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 