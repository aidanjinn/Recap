'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink } from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';

interface NewsArticle {
  article_title: string;
  article_text: string;
  article_link: string;
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'world';
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('language') || 'english');
  const [featuredArticle, setFeaturedArticle] = useState<NewsArticle | null>(null);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedArticles, setExpandedArticles] = useState<Set<number>>(new Set());

  const handleLanguageChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('language', value);
    router.push(`?${params.toString()}`);
    setSelectedLanguage(value);
  };

  const toggleArticle = (index: number) => {
    setExpandedArticles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const endpoint = category === 'sports' ? 'yahoo-sports-recap' : `${category}-news`;
        const response = await fetch(`https://newsapi-r8fr.onrender.com/${endpoint}?language=${selectedLanguage}`);

        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} for link ${response.url}`);
        }
        
        const articles = await response.json();
        
        if (articles && articles.length > 0) {
          setFeaturedArticle(articles[0]);
          setArticles(articles.slice(1));
        } else {
          setFeaturedArticle(null);
          setArticles([]);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setFeaturedArticle(null);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category, selectedLanguage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{category.charAt(0).toUpperCase() + category.slice(1)} News</h1>
        <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="spanish">Spanish</SelectItem>
            <SelectItem value="chinese">Chinese</SelectItem>
            <SelectItem value="japanese">Japanese</SelectItem>
            <SelectItem value="german">German</SelectItem>
            <SelectItem value="russian">Russian</SelectItem>
            <SelectItem value="korean">Korean</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Featured News Card */}
        {featuredArticle && (
          <Card className="col-span-full">
            <div className="aspect-video relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600" />
            </div>
            <div className="p-6">
              <span className="bg-blue-500 text-xs px-2 py-1 rounded text-white">Featured</span>
              <h2 className="text-xl font-semibold leading-tight mt-3 mb-3">{featuredArticle.article_title}</h2>
              <p className={`mt-4 text-base text-gray-600 leading-relaxed ${!expandedArticles.has(-1) ? 'line-clamp-3' : ''}`}>
                {featuredArticle.article_text.split('\n').map((paragraph, i) => (
                  <span key={i} className="block mb-4">{paragraph.trim()}</span>
                ))}
              </p>
              <div className="mt-6 flex justify-between items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleArticle(-1)}
                >
                  {expandedArticles.has(-1) ? 'Show Less' : 'Read More'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(featuredArticle.article_link, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Original
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* News Cards */}
        {articles.map((article, index) => {
          const gradientColors = [
            'from-gray-500 to-slate-600',
            'from-slate-400 to-gray-500',
            'from-neutral-400 to-stone-500',
            'from-zinc-400 to-gray-500',
            'from-stone-400 to-neutral-500'
          ];
          const gradientColor = gradientColors[index % gradientColors.length];

          return (
            <Card key={index}>
              <div className="aspect-video relative mb-4">
                <div className={`absolute inset-0 bg-gradient-to-br ${gradientColor}`} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold leading-tight mb-3">{article.article_title}</h3>
                <p className={`mt-4 text-base text-gray-600 leading-relaxed ${!expandedArticles.has(index) ? 'line-clamp-3' : ''}`}>
                  {article.article_text.split('\n').map((paragraph, i) => (
                    <span key={i} className="block mb-4">{paragraph.trim()}</span>
                  ))}
                </p>
                <div className="mt-6 flex justify-between items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleArticle(index)}
                  >
                    {expandedArticles.has(index) ? 'Show Less' : 'Read More'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(article.article_link, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Original
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
