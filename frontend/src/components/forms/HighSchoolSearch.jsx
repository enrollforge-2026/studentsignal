import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Search } from 'lucide-react';

const HighSchoolSearch = ({ value, onChange, label, placeholder, required = false, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      searchHighSchools();
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  const searchHighSchools = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/reference/high-schools?q=${encodeURIComponent(searchTerm)}`);
      setResults(response.data.high_schools || []);
      setShowResults(true);
    } catch (error) {
      console.error('Failed to search high schools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (school) => {
    setSelectedSchool(school);
    setSearchTerm(school.name);
    setShowResults(false);
    onChange(school.name);
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (e.target.value !== selectedSchool?.name) {
              setSelectedSchool(null);
            }
          }}
          onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
          placeholder={placeholder || 'Search high school...'}
          required={required}
          className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A535C] focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((school) => (
            <button
              key={school.id}
              type="button"
              onClick={() => handleSelect(school)}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">{school.name}</div>
              <div className="text-sm text-gray-500">
                {school.city}, {school.state}
                {school.district && ` • ${school.district}`}
              </div>
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1A535C]"></div>
        </div>
      )}
    </div>
  );
};

export default HighSchoolSearch;