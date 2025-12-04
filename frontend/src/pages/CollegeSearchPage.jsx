import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, DollarSign, GraduationCap, Award, ChevronDown, SlidersHorizontal } from 'lucide-react';
import TopExperienceLayer from '../components/top/TopExperienceLayer';
import Footer from '../components/layout/Footer';
import { formatCurrency, formatPercentage, formatTestScore, formatLocation } from '../utils/formatters';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const PAGE_SIZE = 18;

const CollegeSearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    degreeLevel: [],
    publicPrivate: [],
    minCost: '',
    maxCost: '',
    acceptanceRange: '',
    satRange: '',
    actRange: ''
  });
  const [sortBy, setSortBy] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  // Fetch colleges
  const fetchColleges = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: PAGE_SIZE,
        ...(searchQuery && { search: searchQuery }),
        ...(filters.location && { city: filters.location }),
        ...(filters.degreeLevel.length > 0 && { degreeLevel: filters.degreeLevel.join(',') }),
        ...(filters.publicPrivate.length > 0 && { publicPrivate: filters.publicPrivate.join(',') }),
        ...(filters.minCost && { min_net_price: parseInt(filters.minCost) }),
        ...(filters.maxCost && { max_net_price: parseInt(filters.maxCost) }),
        ...(sortBy && { sort_by: sortBy })
      };

      // Acceptance rate ranges
      if (filters.acceptanceRange) {
        const [min, max] = filters.acceptanceRange.split('-').map(Number);
        params.min_acceptance_rate = min;
        params.max_acceptance_rate = max;
      }

      // SAT ranges
      if (filters.satRange) {
        const [min, max] = filters.satRange.split('-').map(Number);
        params.min_sat = min;
        params.max_sat = max;
      }

      // ACT ranges
      if (filters.actRange) {
        const [min, max] = filters.actRange.split('-').map(Number);
        params.min_act = min;
        params.max_act = max;
      }

      const response = await axios.get(`${BACKEND_URL}/api/colleges`, { params });
      setColleges(response.data.colleges);
      setTotalResults(response.data.total);
      setTotalPages(response.data.pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and when filters change
  useEffect(() => {
    fetchColleges(1);
  }, [searchQuery, filters, sortBy]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchColleges(1);
  };

  // Handle filter changes
  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  // Handle checkbox filters
  const handleCheckboxFilter = (filterKey, value) => {
    setFilters(prev => {
      const currentValues = prev[filterKey];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterKey]: newValues };
    });
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    fetchColleges(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to college detail
  const handleCollegeClick = (college) => {
    navigate(`/college/${college.ipedsId || college.slug}`);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      location: '',
      degreeLevel: [],
      publicPrivate: [],
      minCost: '',
      maxCost: '',
      acceptanceRange: '',
      satRange: '',
      actRange: ''
    });
    setSearchQuery('');
    setSortBy('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopExperienceLayer />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 py-16 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-teal-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              College <span className="text-emerald-600">Search</span>
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Appily makes finding and connecting with the best Colleges and Universities easy. 
              Browse colleges for free, view admissions rates, and other insights to help you build your ideal college list.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Colleges"
                className="w-full pl-14 pr-4 py-4 rounded-full border-2 border-gray-200 focus:border-emerald-500 focus:outline-none text-lg shadow-lg"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <div className={`${showFilters ? 'w-72' : 'w-0'} flex-shrink-0 transition-all duration-300 overflow-hidden`}>
            <div className="bg-white rounded-md shadow-md border border-gray-200 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-[#1a5d3a] hover:underline"
                >
                  Clear all
                </button>
              </div>

              {/* Location */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder="City or State"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5d3a]/20 focus:border-[#1a5d3a]"
                />
              </div>

              {/* Level of Institution */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level of Institution
                </label>
                <div className="space-y-2">
                  {['2-Year', '4-Year'].map(level => (
                    <label key={level} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.degreeLevel.includes(level)}
                        onChange={() => handleCheckboxFilter('degreeLevel', level)}
                        className="w-4 h-4 text-[#1a5d3a] border-gray-300 rounded focus:ring-[#1a5d3a]"
                      />
                      <span className="ml-2 text-sm text-gray-700">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Institution Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution Type
                </label>
                <div className="space-y-2">
                  {['Public', 'Private', 'Private For-Profit'].map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.publicPrivate.includes(type)}
                        onChange={() => handleCheckboxFilter('publicPrivate', type)}
                        className="w-4 h-4 text-[#1a5d3a] border-gray-300 rounded focus:ring-[#1a5d3a]"
                      />
                      <span className="ml-2 text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cost */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost (Avg Net Price)
                </label>
                <div className="space-y-2">
                  <input
                    type="number"
                    value={filters.minCost}
                    onChange={(e) => handleFilterChange('minCost', e.target.value)}
                    placeholder="Min $"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5d3a]/20 focus:border-[#1a5d3a]"
                  />
                  <input
                    type="number"
                    value={filters.maxCost}
                    onChange={(e) => handleFilterChange('maxCost', e.target.value)}
                    placeholder="Max $"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5d3a]/20 focus:border-[#1a5d3a]"
                  />
                </div>
              </div>

              {/* Selectivity */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Award className="inline mr-2" size={16} />
                  Selectivity (Acceptance Rate)
                </label>
                <select
                  value={filters.acceptanceRange}
                  onChange={(e) => handleFilterChange('acceptanceRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">All</option>
                  <option value="0-25">0% - 25% (Most Selective)</option>
                  <option value="25-50">25% - 50%</option>
                  <option value="50-75">50% - 75%</option>
                  <option value="75-100">75% - 100% (Least Selective)</option>
                </select>
              </div>

              {/* Test Scores - SAT */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  SAT Score Range
                </label>
                <select
                  value={filters.satRange}
                  onChange={(e) => handleFilterChange('satRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">All</option>
                  <option value="1400-1600">1400 - 1600</option>
                  <option value="1200-1400">1200 - 1400</option>
                  <option value="1000-1200">1000 - 1200</option>
                  <option value="800-1000">800 - 1000</option>
                </select>
              </div>

              {/* Test Scores - ACT */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ACT Score Range
                </label>
                <select
                  value={filters.actRange}
                  onChange={(e) => handleFilterChange('actRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">All</option>
                  <option value="32-36">32 - 36</option>
                  <option value="27-32">27 - 32</option>
                  <option value="21-27">21 - 27</option>
                  <option value="15-21">15 - 21</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Content - Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-md shadow-md border border-gray-200 p-4 mb-5">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <SlidersHorizontal size={20} />
                    Filters
                  </button>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Browsing {totalResults.toLocaleString()} Colleges
                  </h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Most Popular</option>
                    <option value="acceptance_rate_asc">Acceptance Rate (Low to High)</option>
                    <option value="acceptance_rate_desc">Acceptance Rate (High to Low)</option>
                    <option value="cost_asc">Cost (Low to High)</option>
                    <option value="cost_desc">Cost (High to Low)</option>
                    <option value="name_asc">Name (A-Z)</option>
                    <option value="name_desc">Name (Z-A)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
            )}

            {/* College Grid */}
            {!loading && colleges.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                {colleges.map(college => (
                  <CollegeCard
                    key={college.ipedsId || college.slug}
                    college={college}
                    onClick={() => handleCollegeClick(college)}
                  />
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && colleges.length === 0 && (
              <div className="text-center py-20">
                <p className="text-xl text-gray-600 mb-4">No colleges found matching your criteria</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (currentPage <= 4) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                  } else {
                    pageNum = currentPage - 3 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === pageNum
                          ? 'bg-emerald-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// College Card Component
const CollegeCard = ({ college, onClick }) => {
  const getBadgeColor = (type) => {
    const colors = {
      'Public': 'bg-emerald-600',
      'Private': 'bg-orange-500',
      'Private For-Profit': 'bg-gray-600'
    };
    return colors[type] || 'bg-emerald-600';
  };

  const getDegreeBadgeColor = (level) => {
    return level === '2-Year' ? 'bg-blue-600' : 'bg-purple-600';
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-md shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col"
    >
      {/* College Image */}
      <div className="relative h-48 bg-gray-200">
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600">
          <span className="text-6xl font-bold text-white opacity-50">
            {college.name.substring(0, 1)}
          </span>
        </div>
        {college.imageUrl && (
          <img
            src={college.imageUrl}
            alt={college.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {college.publicPrivate && (
            <span className={`${getBadgeColor(college.publicPrivate)} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
              {college.publicPrivate}
            </span>
          )}
          {college.degreeLevel && (
            <span className={`${getDegreeBadgeColor(college.degreeLevel)} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
              {college.degreeLevel}
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-50">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
          {college.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4">
          {formatLocation(college.city, college.state)}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div>
            <p className="text-gray-500 text-xs mb-1">Acceptance Rate</p>
            <p className="font-semibold text-gray-900">
              {formatPercentage(college.acceptanceRate)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Avg Net Price</p>
            <p className="font-semibold text-gray-900">
              {formatCurrency(college.avgNetPrice)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">In-State Tuition</p>
            <p className="font-semibold text-gray-900">
              {formatCurrency(college.inStateTuition)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">SAT Avg</p>
            <p className="font-semibold text-gray-900">
              {formatTestScore(college.satAvg)}
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <button className="w-full py-2.5 px-4 border-2 border-emerald-600 text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors">
          Will you get accepted?
        </button>
      </div>
    </div>
  );
};

export default CollegeSearchPage;
