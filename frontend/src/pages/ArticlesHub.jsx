import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/top/TopExperienceLayer';
import Footer from '../components/layout/Footer';
import { ArrowRight, Play, BookOpen, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';

const ArticlesHub = () => {
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [videos, setVideos] = useState([]);
  const [guides, setGuides] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const [featuredRes, latestRes, videosRes, collegesRes] = await Promise.all([
        api.get('/api/articles?featured=true&limit=5'),
        api.get('/api/articles?limit=9'),
        api.get('/api/articles?is_video=true&limit=6'),
        api.get('/api/colleges?limit=8')
      ]);

      setFeatured(featuredRes.data.articles);
      setLatest(latestRes.data.articles);
      setVideos(videosRes.data.articles);
      setColleges(collegesRes.data.colleges);

      // Get guides (articles with Guide or List tag)
      const allArticles = latestRes.data.articles;
      const guideArticles = allArticles.filter(a => 
        a.tags.some(t => t.toLowerCase().includes('guide') || t.toLowerCase().includes('list'))
      );
      setGuides(guideArticles.slice(0, 6));

    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextFeatured = () => {
    setFeaturedIndex((prev) => (prev + 1) % featured.length);
  };

  const prevFeatured = () => {
    setFeaturedIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopExperienceLayer />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopExperienceLayer />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Articles & Advice
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Expert guidance, tips, and insights to help you navigate your college journey
          </p>
        </div>

        {/* Featured Slider */}
        {featured.length > 0 && (
          <div className="mb-16">
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-96">
                <img
                  src={featured[featuredIndex].main_image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800'}
                  alt={featured[featuredIndex].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <span className="inline-block px-3 py-1 bg-green-600 rounded-full text-sm font-semibold mb-3">
                    {featured[featuredIndex].category}
                  </span>
                  <h2 className="text-3xl font-bold mb-2">{featured[featuredIndex].title}</h2>
                  <p className="text-gray-200 mb-4">{featured[featuredIndex].summary}</p>
                  <Link
                    to={`/articles/${featured[featuredIndex].slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Read Article <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
              {featured.length > 1 && (
                <>
                  <button
                    onClick={prevFeatured}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextFeatured}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Latest Articles */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.slug}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={article.main_image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold mb-2">
                    {article.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{article.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Videos Section */}
        {videos.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Play className="text-green-700" size={28} />
              <h2 className="text-2xl font-bold text-gray-900">Videos & Deep Dives</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((article) => (
                <Link
                  key={article.id}
                  to={`/articles/${article.slug}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group relative"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={article.main_image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400'}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="text-gray-900 ml-1" size={28} />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold mb-2">
                      Video
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{article.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured Colleges Carousel */}
        {colleges.length > 0 && (
          <section className="mb-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="text-green-700" size={28} />
              <h2 className="text-2xl font-bold text-gray-900">Featured Colleges</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {colleges.slice(0, 4).map((college) => (
                <Link
                  key={college.id}
                  to={`/college/${college.id}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                    <img
                      src={college.image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100'}
                      alt={college.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{college.short_name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{college.state}</p>
                  <span className="inline-flex items-center gap-1 text-sm text-green-700 font-semibold">
                    Learn More <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Guides Section */}
        {guides.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="text-green-700" size={28} />
              <h2 className="text-2xl font-bold text-gray-900">Featured Guides & Lists</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((article) => (
                <Link
                  key={article.id}
                  to={`/articles/${article.slug}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
                >
                  <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-semibold mb-3">
                    Guide
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">{article.summary}</p>
                  <span className="inline-flex items-center gap-1 text-sm text-green-700 font-semibold">
                    Read Guide <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ArticlesHub;
