import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp, Award, GraduationCap } from 'lucide-react';
import api from '../../services/api';
import { topLayerTokens } from '../../styles/topLayerTokens';

const EnterpriseSearch = ({ isOpen, onClose, navHeight = 64 }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ colleges: [], scholarships: [], majors: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      // Prevent body scroll when search is open
      document.body.style.overflow = 'hidden';
    } else {
      setQuery('');
      setResults({ colleges: [], scholarships: [], majors: [] });
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (query.length < 2) {
      setResults({ colleges: [], scholarships: [], majors: [] });
      return;
    }

    // Debounce search
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
    }, 100);

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

  const hasResults = results.colleges.length > 0 || results.scholarships.length > 0 || results.majors.length > 0;

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile: Full-Screen Modal */}
      <div className="md:hidden fixed inset-0 z-[60] bg-white flex flex-col animate-fadeIn">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Search</h2>
          <button
            onClick={onClose}
            className={`flex items-center justify-center w-10 h-10 ${topLayerTokens.radius.button} hover:bg-gray-100 ${topLayerTokens.animation.timing} ${topLayerTokens.animation.duration}`}
          >
            <X size={topLayerTokens.iconSize.medium} />
          </button>
        </div>

        {/* Mobile Search Input */}
        <div className="p-4">
          <form onSubmit={handleSubmit} className="relative">
            <div className={`relative bg-white ${topLayerTokens.radius.panel} border-2 border-gray-200 focus-within:border-[#1a5d3a] ${topLayerTokens.animation.timing} ${topLayerTokens.animation.duration}`}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={topLayerTokens.iconSize.medium} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search colleges, scholarships..."
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
                  {/* Mobile Colleges */}
                  {results.colleges.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                        <GraduationCap size={topLayerTokens.iconSize.small} className="text-[#1a5d3a]" />
                        <h3 className={`${topLayerTokens.typography.sectionTitle} text-gray-700`}>Colleges</h3>
                      </div>
                      <div className="space-y-2">
                        {results.colleges.map((college) => (
                          <button
                            key={college.id}
                            onClick={() => handleCollegeClick(college.id)}
                            className={`w-full text-left ${topLayerTokens.padding.item} ${topLayerTokens.radius.button} hover:bg-gray-50 ${topLayerTokens.animation.timing} ${topLayerTokens.animation.duration} group`}
                          >
                            <div className="flex items-start gap-3">
                              {college.image && (
                                <img
                                  src={college.image}
                                  alt={college.name}
                                  className="w-12 h-12 rounded object-cover flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className={`${topLayerTokens.typography.itemTitle} text-gray-900 group-hover:text-[#1a5d3a] truncate`}>
                                  {college.name}
                                </div>
                                <div className={`${topLayerTokens.typography.itemSubtext} text-gray-500`}>{college.location}</div>
                                {college.acceptance_rate && (
                                  <div className={`${topLayerTokens.typography.itemSubtext} text-gray-400 mt-0.5`}>
                                    {college.acceptance_rate} acceptance
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mobile Scholarships */}
                  {results.scholarships.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                        <Award size={topLayerTokens.iconSize.small} className="text-[#1a5d3a]" />
                        <h3 className={`${topLayerTokens.typography.sectionTitle} text-gray-700`}>Scholarships</h3>
                      </div>
                      <div className="space-y-2">
                        {results.scholarships.map((scholarship) => (
                          <button
                            key={scholarship.id}
                            onClick={handleScholarshipClick}
                            className={`w-full text-left ${topLayerTokens.padding.item} ${topLayerTokens.radius.button} hover:bg-gray-50 ${topLayerTokens.animation.timing} ${topLayerTokens.animation.duration} group`}
                          >
                            <div className={`${topLayerTokens.typography.itemTitle} text-gray-900 group-hover:text-[#1a5d3a]`}>
                              {scholarship.name}
                            </div>
                            <div className={`${topLayerTokens.typography.itemSubtext} text-green-600 font-semibold mt-1`}>
                              ${scholarship.amount?.toLocaleString()}
                            </div>
                            {scholarship.deadline && (
                              <div className={`${topLayerTokens.typography.itemSubtext} text-gray-400 mt-0.5`}>
                                Due: {scholarship.deadline}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mobile Majors */}
                  {results.majors.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                        <TrendingUp size={topLayerTokens.iconSize.small} className="text-[#1a5d3a]" />
                        <h3 className={`${topLayerTokens.typography.sectionTitle} text-gray-700`}>Fields & Majors</h3>
                      </div>
                      <div className="space-y-2">
                        {results.majors.map((major, index) => (
                          <button
                            key={index}
                            onClick={() => handleMajorClick(major)}
                            className={`w-full text-left ${topLayerTokens.padding.item} ${topLayerTokens.radius.button} hover:bg-gray-50 ${topLayerTokens.animation.timing} ${topLayerTokens.animation.duration} group`}
                          >
                            <div className={`font-medium text-sm text-gray-900 group-hover:text-[#1a5d3a]`}>
                              {major}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Desktop: Overlay Panel Under Nav */}
      <div
        className="hidden md:block fixed left-0 right-0 z-[60] bg-white border-b border-gray-100"
        style={{
          top: `${navHeight}px`,
          animation: 'slideDownFade 0.15s ease-out',
        }}
      >
        <div className={`${topLayerTokens.layout.maxWidth} mx-auto ${topLayerTokens.layout.padding}`}>
          <div className="py-5">
            <form onSubmit={handleSubmit} className="relative">
              <div className={`relative bg-white ${topLayerTokens.radius.panel} border border-gray-200 ${topLayerTokens.shadow.panel} ${topLayerTokens.shadow.hover} ${topLayerTokens.animation.timing} ${topLayerTokens.animation.duration}`}>
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={topLayerTokens.iconSize.medium} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search colleges, scholarships, fields of study..."
                  className="w-full pl-14 pr-14 py-4 text-base font-normal bg-transparent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={onClose}
                  className={`absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 ${topLayerTokens.animation.timing} ${topLayerTokens.animation.duration}`}
                >
                  <X size={topLayerTokens.iconSize.medium} />
                </button>
              </div>
            </form>
          </div>

          {/* Autocomplete Results */}
          {query.length >= 2 && (
            <div className="pb-5 max-h-96 overflow-y-auto">
              <div className={`bg-white ${topLayerTokens.radius.panel} border border-gray-100 ${topLayerTokens.shadow.panel} ${topLayerTokens.padding.panelMobile} md:${topLayerTokens.padding.panel}`}>
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
                  <div className={`grid grid-cols-1 md:grid-cols-3 ${topLayerTokens.spacing.section}`}>
                    {/* Colleges */}
                    {results.colleges.length > 0 && (
                      <div>
                        <div className={`flex items-center ${topLayerTokens.spacing.item} mb-3 pb-2 border-b border-gray-200`}>
                          <GraduationCap size={topLayerTokens.iconSize.small} className="text-[#1a5d3a]" />
                          <h3 className={`${topLayerTokens.typography.sectionTitle} text-gray-700`}>Colleges</h3>
                        </div>
                        <div className="space-y-2">
                          {results.colleges.map((college) => (
                            <button
                              key={college.id}
                              onClick={() => handleCollegeClick(college.id)}
                              className={`w-full text-left ${topLayerTokens.padding.item} ${topLayerTokens.radius.button} hover:bg-gray-50 ${topLayerTokens.animation.timing} ${topLayerTokens.animation.duration} group`}
                            >
                              <div className="flex items-start gap-3">
                                {college.image && (
                                  <img
                                    src={college.image}
                                    alt={college.name}
                                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className={`${topLayerTokens.typography.itemTitle} text-gray-900 group-hover:text-[#1a5d3a] truncate`}>
                                    {college.name}
                                  </div>
                                  <div className={`${topLayerTokens.typography.itemSubtext} text-gray-500`}>{college.location}</div>
                                  {college.acceptance_rate && (
                                    <div className={`${topLayerTokens.typography.itemSubtext} text-gray-400 mt-0.5`}>
                                      {college.acceptance_rate} acceptance
                                    </div>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Scholarships */}
                    {results.scholarships.length > 0 && (
                      <div>
                        <div className={`flex items-center ${topLayerTokens.spacing.item} mb-3 pb-2 border-b border-gray-200`}>
                          <Award size={topLayerTokens.iconSize.small} className="text-[#1a5d3a]" />
                          <h3 className={`${topLayerTokens.typography.sectionTitle} text-gray-700`}>Scholarships</h3>
                        </div>
                        <div className="space-y-2">
                          {results.scholarships.map((scholarship) => (
                            <button
                              key={scholarship.id}
                              onClick={handleScholarshipClick}
                              className={`w-full text-left ${topLayerTokens.padding.item} ${topLayerTokens.radius.button} hover:bg-gray-50 ${topLayerTokens.animation.timing} ${topLayerTokens.animation.duration} group`}
                            >
                              <div className={`${topLayerTokens.typography.itemTitle} text-gray-900 group-hover:text-[#1a5d3a]`}>
                                {scholarship.name}
                              </div>
                              <div className={`${topLayerTokens.typography.itemSubtext} text-green-600 font-semibold mt-1`}>
                                ${scholarship.amount?.toLocaleString()}
                              </div>
                              {scholarship.deadline && (
                                <div className={`${topLayerTokens.typography.itemSubtext} text-gray-400 mt-0.5`}>
                                  Due: {scholarship.deadline}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Majors */}
                    {results.majors.length > 0 && (
                      <div>
                        <div className={`flex items-center ${topLayerTokens.spacing.item} mb-3 pb-2 border-b border-gray-200`}>
                          <TrendingUp size={topLayerTokens.iconSize.small} className="text-[#1a5d3a]" />
                          <h3 className={`${topLayerTokens.typography.sectionTitle} text-gray-700`}>Fields & Majors</h3>
                        </div>
                        <div className="space-y-2">
                          {results.majors.map((major, index) => (
                            <button
                              key={index}
                              onClick={() => handleMajorClick(major)}
                              className={`w-full text-left ${topLayerTokens.padding.item} ${topLayerTokens.radius.button} hover:bg-gray-50 ${topLayerTokens.animation.timing} ${topLayerTokens.animation.duration} group`}
                            >
                              <div className={`font-medium text-sm text-gray-900 group-hover:text-[#1a5d3a]`}>
                                {major}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop - Desktop Only */}
      <div
        className="hidden md:block fixed inset-0 bg-black/20 z-[55]"
        style={{ animation: 'fadeIn 0.15s ease-out' }}
        onClick={onClose}
      />
    </>
  );
};

export default EnterpriseSearch;
