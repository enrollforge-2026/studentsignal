import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/top/TopExperienceLayer';
import Footer from '../components/layout/Footer';
import { Calendar, Tag, Play, X, ArrowRight, Clock } from 'lucide-react';
import api from '../services/api';

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
  // Check if article is long (more than 3 paragraphs worth of content)
  const isLongArticle = article?.body && article.body.split('\n').filter(p => p.trim()).length > 8;

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
        <TopExperienceLayer />
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
        <TopExperienceLayer />
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

  // Split article into intro and remaining content
  const getArticleContent = () => {
    if (!article?.body) return { intro: [], remaining: [] };
    
    const paragraphs = article.body.split('\n').filter(p => p.trim());
    
    if (!isLongArticle || expanded) {
      return { intro: paragraphs, remaining: [] };
    }
    
    // Show first 3-4 paragraphs as intro
    const introCount = Math.min(4, Math.ceil(paragraphs.length * 0.3));
    return {
      intro: paragraphs.slice(0, introCount),
      remaining: paragraphs.slice(introCount)
    };
  };

  const { intro, remaining } = getArticleContent();

  const renderParagraph = (paragraph, index) => {
    if (paragraph.trim().startsWith('##')) {
      return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-3">{paragraph.replace('##', '').trim()}</h2>;
    } else if (paragraph.trim().startsWith('#')) {
      return <h3 key={index} className="text-xl font-bold text-gray-900 mt-5 mb-2">{paragraph.replace('#', '').trim()}</h3>;
    } else if (paragraph.trim().startsWith('- ')) {
      return <li key={index} className="text-gray-700 mb-2 ml-4">{paragraph.replace('- ', '').trim()}</li>;
    } else if (paragraph.trim()) {
      return <p key={index} className="text-gray-700 leading-relaxed mb-4">{paragraph}</p>;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopExperienceLayer />

      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/articles" className="text-green-700 font-semibold hover:underline">
            ← Back to Articles
          </Link>
        </div>

        {/* Single Unified Container for All Article Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Hero Image */}
          <div className="aspect-video overflow-hidden">
            <img
              src={article.main_image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800'}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Content - All in one continuous flow */}
          <div className="p-8">
            {/* Tags & Category */}
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

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-3">{article.title}</h1>

            {/* Meta: Date + Reading Time */}
            <div className="flex items-center gap-4 text-gray-600 text-sm mb-6">
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                {new Date(article.published_at).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
              {article.read_time_minutes && (
                <span className="flex items-center gap-2">
                  <Clock size={16} />
                  {article.read_time_minutes} min read
                </span>
              )}
            </div>

            {/* Watch Video CTA - Inside same container, visually distinct */}
            {article.video_url && (
              <div className="mb-6 -mx-4 sm:mx-0">
                <button
                  onClick={() => setShowVideo(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg sm:rounded-xl p-5 hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-3 shadow-md"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Play size={20} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-base">Watch Video</div>
                    <div className="text-sm text-white/90">Full video explanation and insights</div>
                  </div>
                </button>
              </div>
            )}

            {/* Article Body - Continuous flow */}
            <div className="prose prose-lg max-w-none">
              {intro.map((paragraph, index) => renderParagraph(paragraph, index))}
              
              {/* "Read More" functionality for long articles */}
              {!expanded && remaining.length > 0 && (
                <div className="mt-6">
                  <button
                    onClick={() => setExpanded(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Read more
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}

              {/* Expanded content (shown when "Read more" is clicked) */}
              {expanded && remaining.map((paragraph, index) => renderParagraph(paragraph, `expanded-${index}`))}
            </div>
          </div>
        </div>

        {/* Related Articles - Outside the main container */}
        {related.length > 0 && (
          <div className="mt-12">
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

      {/* Floating Video Player - Light backdrop blur, not full-screen takeover */}
      {showVideo && article.video_url && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ 
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
          }}
          onClick={() => setShowVideo(false)}
        >
          {/* Floating video card */}
          <div 
            className="relative bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button on the card */}
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-3 right-3 z-10 p-2 bg-gray-900/70 rounded-full hover:bg-gray-900/90 transition-colors"
            >
              <X className="text-white" size={20} />
            </button>
            
            {/* Video iframe */}
            <div className="aspect-video">
              <iframe
                src={getVideoEmbedUrl(article.video_url)}
                className="w-full h-full"
                allowFullScreen
                title={article.title}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ArticleDetail;
