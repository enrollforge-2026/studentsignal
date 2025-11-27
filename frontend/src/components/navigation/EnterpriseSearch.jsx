import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp, Award, GraduationCap } from 'lucide-react';
import api from '../../services/api';

const EnterpriseSearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ colleges: [], scholarships: [], majors: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults({ colleges: [], scholarships: [], majors: [] });
    }
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
      {/* Search Panel - Inside Header */}
      <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-100 z-50 animate-slideDown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-180">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
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
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </form>
          </div>

          {/* Autocomplete Results */}
          {query.length >= 2 && (
            <div className="pb-4 max-h-96 overflow-y-auto">
              <div className="bg-white rounded-xl border border-gray-100 shadow-2xl p-4">
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Colleges */}
                    {results.colleges.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                          <GraduationCap size={16} className="text-[#1a5d3a]" />
                          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Colleges</h3>
                        </div>
                        <div className="space-y-2">
                          {results.colleges.map((college) => (
                            <button
                              key={college.id}
                              onClick={() => handleCollegeClick(college.id)}
                              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors group"
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
                                  <div className="font-semibold text-sm text-gray-900 group-hover:text-[#1a5d3a] truncate">
                                    {college.name}
                                  </div>
                                  <div className="text-xs text-gray-500">{college.location}</div>
                                  {college.acceptance_rate && (
                                    <div className="text-xs text-gray-400 mt-0.5">
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
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                          <Award size={16} className="text-[#1a5d3a]" />
                          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Scholarships</h3>
                        </div>
                        <div className="space-y-2">
                          {results.scholarships.map((scholarship) => (
                            <button
                              key={scholarship.id}
                              onClick={handleScholarshipClick}
                              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                              <div className="font-semibold text-sm text-gray-900 group-hover:text-[#1a5d3a]">
                                {scholarship.name}
                              </div>
                              <div className="text-xs text-green-600 font-semibold mt-1">
                                ${scholarship.amount?.toLocaleString()}
                              </div>
                              {scholarship.deadline && (
                                <div className="text-xs text-gray-400 mt-0.5">
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
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                          <TrendingUp size={16} className="text-[#1a5d3a]" />
                          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Fields & Majors</h3>
                        </div>
                        <div className="space-y-2">
                          {results.majors.map((major, index) => (
                            <button
                              key={index}
                              onClick={() => handleMajorClick(major)}
                              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                              <div className="font-medium text-sm text-gray-900 group-hover:text-[#1a5d3a]">
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

      {/* Backdrop - Click Outside to Close */}
      <div
        className="fixed inset-0 bg-black/20 z-40 animate-fadeIn"
        onClick={onClose}
      />
    </>
  );
};

export default EnterpriseSearch;
