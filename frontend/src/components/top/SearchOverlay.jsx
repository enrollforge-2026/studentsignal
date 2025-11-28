import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, GraduationCap, Award, TrendingUp, BookOpen } from 'lucide-react';
import api from '../../services/api';

const SearchOverlay = ({ isOpen, onClose, topOffset }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ colleges: [], scholarships: [], majors: [], articles: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      setQuery('');
      setResults({ colleges: [], scholarships: [], majors: [], articles: [] });
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (query.length < 2) {
      setResults({ colleges: [], scholarships: [], majors: [], articles: [] });
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const response = await api.get(`/api/search/autocomplete?q=${encodeURIComponent(query)}`);
        setResults(response.data);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/colleges?search=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  const handleCollegeClick = (collegeId) => {
    navigate(`/colleges/${collegeId}`);
    onClose();
  };

  const handleScholarshipClick = () => {
    navigate(`/scholarships?search=${encodeURIComponent(query)}`);
    onClose();
  };

  const handleMajorClick = (major) => {
    navigate(`/colleges?major=${encodeURIComponent(major)}`);
    onClose();
  };

  const handleArticleClick = () => {
    navigate(`/articles?search=${encodeURIComponent(query)}`);
    onClose();
  };

  const hasResults =
    results.colleges.length > 0 ||
    results.scholarships.length > 0 ||
    results.majors.length > 0 ||
    results.articles.length > 0;

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile: Full-Screen Modal */}
      <div
        className="md:hidden fixed inset-0 bg-white flex flex-col z-[40]"
        style={{ animation: 'fadeIn 150ms ease-out' }}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Search</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-all duration-150"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mobile Search Input */}
        <div className="p-4">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative bg-white rounded-2xl border-2 border-gray-200 focus-within:border-[#00A86B] transition-all duration-150">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search colleges, scholarships, majors..."
                className="w-full pl-12 pr-4 py-3 text-base bg-transparent focus:outline-none"
              />
            </div>
          </form>
        </div>

        {/* Mobile Results */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {query.length >= 2 && (
            <>
              {loading && (
                <div className="text-center py-12 text-gray-500">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a5d3a] mx-auto"></div>
                  <p className="mt-3 text-sm">Searching...</p>
                </div>
              )}

              {!loading && !hasResults && (
                <div className="text-center py-12 text-gray-500">
                  <Search className="mx-auto mb-3 text-gray-400" size={40} />
                  <p className="text-sm">No results found for "{query}"</p>
                </div>
              )}

              {!loading && hasResults && (
                <div className="space-y-6">
                  {results.colleges.length > 0 && (
                    <ResultSection
                      icon={<GraduationCap size={16} />}
                      title="COLLEGES"
                      results={results.colleges}
                      onItemClick={handleCollegeClick}
                      renderItem={(college) => (
                        <>
                          <div className="font-semibold text-sm text-gray-900">{college.name}</div>
                          <div className="text-xs text-gray-500">{college.location}</div>
                        </>
                      )}
                    />
                  )}

                  {results.scholarships.length > 0 && (
                    <ResultSection
                      icon={<Award size={16} />}
                      title="SCHOLARSHIPS"
                      results={results.scholarships}
                      onItemClick={handleScholarshipClick}
                      renderItem={(scholarship) => (
                        <>
                          <div className="font-semibold text-sm text-gray-900">{scholarship.name}</div>
                          <div className="text-xs text-green-600 font-semibold">
                            ${scholarship.amount?.toLocaleString()}
                          </div>
                        </>
                      )}
                    />
                  )}

                  {results.majors.length > 0 && (
                    <ResultSection
                      icon={<TrendingUp size={16} />}
                      title="FIELDS & MAJORS"
                      results={results.majors}
                      onItemClick={handleMajorClick}
                      renderItem={(major) => (
                        <div className="font-semibold text-sm text-gray-900">{major}</div>
                      )}
                    />
                  )}

                  {results.articles && results.articles.length > 0 && (
                    <ResultSection
                      icon={<BookOpen size={16} />}
                      title="ARTICLES & GUIDES"
                      results={results.articles}
                      onItemClick={handleArticleClick}
                      renderItem={(article) => (
                        <div className="font-semibold text-sm text-gray-900">{article.title || article}</div>
                      )}
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Desktop: Overlay Panel */}
      <div
        className="hidden md:block fixed left-0 right-0 bg-white border-b border-gray-100"
        style={{
          top: `${topOffset}px`,
          zIndex: 40,
          animation: 'slideDownFade 120ms ease-out',
          boxShadow: '0 18px 48px rgba(0,0,0,0.12)',
        }}
      >
        <div className="max-w-[1220px] mx-auto px-4 py-6">
          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="relative mb-4">
            <div
              className="relative bg-white rounded-2xl border-2 border-gray-200 focus-within:border-[#00A86B] transition-all duration-150"
              style={{ height: '56px', boxShadow: '0 6px 24px rgba(0,0,0,0.08)' }}
            >
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search colleges, scholarships, fields of study..."
                className="w-full h-full pl-14 pr-14 text-base font-normal bg-transparent focus:outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-150"
                style={{ zIndex: 10 }}
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </div>
          </form>

          {/* Results Panel */}
          {query.length >= 2 && (
            <div
              className="bg-white rounded-b-[20px] p-6"
              style={{ maxHeight: '400px', overflowY: 'auto' }}
            >
              {loading && (
                <div className="text-center py-8 text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a5d3a] mx-auto"></div>
                  <p className="mt-2 text-sm">Searching...</p>
                </div>
              )}

              {!loading && !hasResults && (
                <div className="text-center py-8 text-gray-500">
                  <Search className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-sm">No results found for "{query}"</p>
                </div>
              )}

              {!loading && hasResults && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {results.colleges.length > 0 && (
                    <ResultSection
                      icon={<GraduationCap size={16} />}
                      title="COLLEGES"
                      results={results.colleges}
                      onItemClick={handleCollegeClick}
                      renderItem={(college) => (
                        <>
                          <div className="font-semibold text-sm text-gray-900">{college.name}</div>
                          <div className="text-xs text-gray-500">{college.location}</div>
                        </>
                      )}
                    />
                  )}

                  {results.scholarships.length > 0 && (
                    <ResultSection
                      icon={<Award size={16} />}
                      title="SCHOLARSHIPS"
                      results={results.scholarships}
                      onItemClick={handleScholarshipClick}
                      renderItem={(scholarship) => (
                        <>
                          <div className="font-semibold text-sm text-gray-900">{scholarship.name}</div>
                          <div className="text-xs text-green-600 font-semibold">
                            ${scholarship.amount?.toLocaleString()}
                          </div>
                        </>
                      )}
                    />
                  )}

                  {results.majors.length > 0 && (
                    <ResultSection
                      icon={<TrendingUp size={16} />}
                      title="FIELDS & MAJORS"
                      results={results.majors}
                      onItemClick={handleMajorClick}
                      renderItem={(major) => (
                        <div className="font-semibold text-sm text-gray-900">{major}</div>
                      )}
                    />
                  )}

                  {results.articles && results.articles.length > 0 && (
                    <ResultSection
                      icon={<BookOpen size={16} />}
                      title="ARTICLES & GUIDES"
                      results={results.articles}
                      onItemClick={handleArticleClick}
                      renderItem={(article) => (
                        <div className="font-semibold text-sm text-gray-900">{article.title || article}</div>
                      )}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Backdrop - Desktop Only */}
      <div
        className="hidden md:block fixed inset-0 bg-black/20"
        style={{ zIndex: 35, animation: 'fadeIn 150ms ease-out' }}
        onClick={onClose}
      />
    </>
  );
};

const ResultSection = ({ icon, title, results, onItemClick, renderItem }) => (
  <div>
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
      <span className="text-[#1a5d3a]">{icon}</span>
      <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>
        {title}
      </h3>
    </div>
    <div className="space-y-2">
      {results.slice(0, 5).map((item, index) => (
        <button
          key={item.id || index}
          onClick={() => onItemClick(item.id || item)}
          className="w-full text-left p-3 rounded-lg hover:bg-[#F9FAFB] transition-all duration-150"
          style={{ minHeight: '64px' }}
        >
          {renderItem(item)}
        </button>
      ))}
    </div>
  </div>
);

export default SearchOverlay;
