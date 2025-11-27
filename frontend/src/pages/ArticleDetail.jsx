import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Calendar, Tag, Play, X, ArrowRight } from 'lucide-react';
import api from '../services/api';

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/articles/${slug}`);
      setArticle(response.data);

      // Load related articles
      const relatedRes = await api.get(`/api/articles?category=${response.data.category}&limit=4`);
      const filtered = relatedRes.data.articles.filter(a => a.slug !== slug).slice(0, 3);
      setRelated(filtered);
    } catch (error) {
      console.error('Failed to load article:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVideoEmbedUrl = (url) => {
    if (!url) return null;
    
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    
    return url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading article...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <Link to="/articles" className="text-green-700 font-semibold hover:underline">
            ← Back to Articles
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/articles" className="text-green-700 font-semibold hover:underline">
            ← Back to Articles
          </Link>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="aspect-video overflow-hidden">
            <img
              src={article.main_image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800'}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                {article.category}
              </span>
              {article.tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center gap-1 text-sm text-gray-600">
                  <Tag size={14} />
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
            <div className="flex items-center gap-4 text-gray-600 text-sm">
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                {new Date(article.published_at).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Video Lightbox Trigger */}
        {article.video_url && (
          <div className="mb-8">
            <button
              onClick={() => setShowVideo(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-6 hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-3 shadow-lg"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Play size={28} />
              </div>
              <div className="text-left">
                <div className="font-bold text-lg">Watch Video</div>
                <div className="text-sm text-white/90">Full video explanation and insights</div>
              </div>
            </button>
          </div>
        )}

        {/* Article Body */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            {article.body.split('\n').map((paragraph, index) => {
              if (paragraph.trim().startsWith('##')) {
                return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{paragraph.replace('##', '').trim()}</h2>;
              } else if (paragraph.trim().startsWith('#')) {
                return <h3 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">{paragraph.replace('#', '').trim()}</h3>;
              } else if (paragraph.trim().startsWith('- ')) {
                return <li key={index} className="text-gray-700 mb-2">{paragraph.replace('- ', '').trim()}</li>;
              } else if (paragraph.trim()) {
                return <p key={index} className="text-gray-700 leading-relaxed mb-4">{paragraph}</p>;
              }
              return null;
            })}
          </div>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">More from Student Signal</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  to={`/articles/${relatedArticle.slug}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={relatedArticle.main_image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400'}
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold mb-2">
                      {relatedArticle.category}
                    </span>
                    <h3 className="font-bold text-gray-900 line-clamp-2">{relatedArticle.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Video Lightbox */}
      {showVideo && article.video_url && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setShowVideo(false)}
            className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <X className="text-white" size={28} />
          </button>
          <div className="w-full max-w-5xl aspect-video">
            <iframe
              src={getVideoEmbedUrl(article.video_url)}
              className="w-full h-full rounded-lg"
              allowFullScreen
              title={article.title}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ArticleDetail;
