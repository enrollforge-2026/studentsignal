import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { colleges, states, majorsList } from '../data/mockData';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { Search, Bookmark, MapPin, ChevronDown } from 'lucide-react';

const CollegesPageNew = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [filteredColleges, setFilteredColleges] = useState(colleges);
  const [filters, setFilters] = useState({
    location: [],
    levelOfInstitution: [],
    institutionType: [],
    majors: [],
    selectivity: [],
    actScore: '',
    satScore: '',
    campusSetting: [],
    studentBodySize: [],
    searchQuery: initialSearch
  });
  const [sortBy, setSortBy] = useState('mostPopular');
  const [savedColleges, setSavedColleges] = useState([]);
  const [showMoreMajors, setShowMoreMajors] = useState(false);

  useEffect(() => {
    let filtered = colleges;

    // Location filter
    if (filters.location.length > 0) {
      filtered = filtered.filter(c => filters.location.includes(c.state));
    }

    // Institution type filter
    if (filters.institutionType.length > 0) {
      filtered = filtered.filter(c => filters.institutionType.includes(c.type));
    }

    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.shortName.toLowerCase().includes(query) ||
        c.location.toLowerCase().includes(query) ||
        c.majors.some(m => m.toLowerCase().includes(query))
      );
    }

    // Sort
    if (sortBy === 'mostSelective') {
      filtered = [...filtered].sort((a, b) => a.acceptanceRate - b.acceptanceRate);
    } else if (sortBy === 'leastSelective') {
      filtered = [...filtered].sort((a, b) => b.acceptanceRate - a.acceptanceRate);
    } else if (sortBy === 'lowestNetPrice') {
      filtered = [...filtered].sort((a, b) => a.tuitionInState - b.tuitionInState);
    }

    setFilteredColleges(filtered);
  }, [filters, sortBy]);

  const clearFilters = () => {
    setFilters({
      location: [],
      levelOfInstitution: [],
      institutionType: [],
      majors: [],
      selectivity: [],
      actScore: '',
      satScore: '',
      campusSetting: [],
      studentBodySize: [],
      searchQuery: ''
    });
  };

  const toggleFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(v => v !== value)
        : [...prev[filterType], value]
    }));
  };

  const toggleSaveCollege = (collegeId) => {
    setSavedColleges(prev => 
      prev.includes(collegeId) 
        ? prev.filter(id => id !== collegeId)
        : [...prev, collegeId]
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section with Search */}
      <section className="relative bg-gradient-to-br from-blue-50 to-cyan-50 py-16">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920" 
            alt="College campus" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              College Search
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Appily makes finding and comparing with the best colleges and universities easy. Browse using our 
              college search engine and see reviews, virtual tours, admission rates, and other insights to help you build 
              your college list.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
              <input
                type="text"
                placeholder="Search Colleges"
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                className="w-full pl-14 pr-4 py-4 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1a5d3a] focus:border-[#1a5d3a] bg-white"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 bg-gray-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-6">
            {/* Sidebar Filters */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[#1a5d3a] hover:underline"
                  >
                    Clear all
                  </button>
                </div>

                {/* Location */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-3">Location</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {states.slice(0, 10).map((state) => (
                      <label key={state} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.location.includes(state)}
                          onChange={() => toggleFilter('location', state)}
                          className="w-4 h-4 text-[#1a5d3a] border-gray-300 rounded focus:ring-[#1a5d3a]"
                        />
                        <span className="text-sm text-gray-700">{state}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Level of Institution */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <label className="block text-sm font-medium text-gray-900 mb-3">Level of Institution</label>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-[#1a5d3a] border-gray-300 rounded focus:ring-[#1a5d3a]"
                        />
                        <span className="text-sm text-gray-700">4 Year</span>
                      </div>
                      <span className="text-sm text-gray-500">2,689</span>
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-[#1a5d3a] border-gray-300 rounded focus:ring-[#1a5d3a]"
                        />
                        <span className="text-sm text-gray-700">2 Year</span>
                      </div>
                      <span className="text-sm text-gray-500">1,042</span>
                    </label>
                  </div>
                </div>

                {/* Institution Type */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <label className="block text-sm font-medium text-gray-900 mb-3">Institution Type</label>
                  <div className="space-y-2">
                    {['Public', 'Private'].map((type) => {
                      const count = colleges.filter(c => c.type === type).length;
                      return (
                        <label key={type} className="flex items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={filters.institutionType.includes(type)}
                              onChange={() => toggleFilter('institutionType', type)}
                              className="w-4 h-4 text-[#1a5d3a] border-gray-300 rounded focus:ring-[#1a5d3a]"
                            />
                            <span className="text-sm text-gray-700">{type}</span>
                          </div>
                          <span className="text-sm text-gray-500">{count}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Majors */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <label className="block text-sm font-medium text-gray-900 mb-3">Majors</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5d3a]/20 focus:border-[#1a5d3a]">
                    <option value="">Select Major</option>
                    {majorsList.slice(0, 20).map((major) => (
                      <option key={major} value={major}>{major}</option>
                    ))}
                  </select>
                </div>

                {/* Selectivity */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <label className="block text-sm font-medium text-gray-900 mb-3">Selectivity</label>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-[#1a5d3a] border-gray-300 rounded focus:ring-[#1a5d3a]"
                        />
                        <span className="text-sm text-gray-700">Most Selective (0 - 10%)</span>
                      </div>
                      <span className="text-sm text-gray-500">33</span>
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-[#1a5d3a] border-gray-300 rounded focus:ring-[#1a5d3a]"
                        />
                        <span className="text-sm text-gray-700">Very Selective (10% - 25%)</span>
                      </div>
                      <span className="text-sm text-gray-500">74</span>
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-[#1a5d3a] border-gray-300 rounded focus:ring-[#1a5d3a]"
                        />
                        <span className="text-sm text-gray-700">Selective (25% - 50%)</span>
                      </div>
                      <span className="text-sm text-gray-500">183</span>
                    </label>
                  </div>
                </div>

                {/* Test Scores */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <label className="block text-sm font-medium text-gray-900 mb-3">Your Test Scores</label>
                  
                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-2">ACT</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5d3a]/20 focus:border-[#1a5d3a]">
                      <option value="">Select ACT Score</option>
                      <option value="below16">Below 16</option>
                      <option value="16-20">16 - 20</option>
                      <option value="21-25">21 - 25</option>
                      <option value="25-30">25 - 30</option>
                      <option value="above30">Above 30</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">SAT</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5d3a]/20 focus:border-[#1a5d3a]">
                      <option value="">Select SAT Score</option>
                      <option value="below860">Below 860</option>
                      <option value="860-1050">860 - 1050</option>
                      <option value="1060-1230">1060 - 1230</option>
                      <option value="1240-1420">1240 - 1420</option>
                      <option value="above1420">Above 1420</option>
                    </select>
                  </div>
                </div>

                {/* Campus Setting */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <label className="block text-sm font-medium text-gray-900 mb-3">Campus Setting</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#1a5d3a] border-gray-300 rounded focus:ring-[#1a5d3a]"
                      />
                      <span className="text-sm text-gray-700">Suburb or town</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#1a5d3a] border-gray-300 rounded focus:ring-[#1a5d3a]"
                      />
                      <span className="text-sm text-gray-700">Small city</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#1a5d3a] border-gray-300 rounded focus:ring-[#1a5d3a]"
                      />
                      <span className="text-sm text-gray-700">Major city</span>
                    </label>
                  </div>
                </div>

                {/* Student Body Size */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <label className="block text-sm font-medium text-gray-900 mb-3">Student Body Size</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#1a5d3a] border-gray-300 rounded focus:ring-[#1a5d3a]"
                      />
                      <span className="text-sm text-gray-700">Small (&lt;5,000)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#1a5d3a] border-gray-300 rounded focus:ring-[#1a5d3a]"
                      />
                      <span className="text-sm text-gray-700">Midsize (5,000 - 15,000)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#1a5d3a] border-gray-300 rounded focus:ring-[#1a5d3a]"
                      />
                      <span className="text-sm text-gray-700">Large (&gt;15,000)</span>
                    </label>
                  </div>
                </div>

                {/* Special Attributes */}
                <div className="mb-6">
                  <button className="w-full text-left text-sm font-medium text-[#1a5d3a] hover:underline">
                    More Filters
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Sort and Count */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-semibold">{filteredColleges.length}</span> Colleges
                  </p>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5d3a]/20 focus:border-[#1a5d3a]"
                >
                  <option value="mostPopular">Most Popular</option>
                  <option value="mostSelective">Most Selective to Least Selective</option>
                  <option value="leastSelective">Least Selective to Most Selective</option>
                  <option value="lowestNetPrice">Lowest to Highest Net Price</option>
                  <option value="lowestSticker">Lowest to Highest Sticker Price</option>
                </select>
              </div>

              {/* College Cards */}
              <div className="space-y-6">
                {filteredColleges.map((college) => (
                  <div
                    key={college.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* College Image */}
                      <div className="md:w-80 h-48 md:h-auto flex-shrink-0">
                        <img
                          src={college.image}
                          alt={college.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* College Details */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <Link to={`/college/${college.id}`}>
                              <h3 className="text-xl font-bold text-gray-900 hover:text-[#1a5d3a] cursor-pointer mb-1">
                                {college.name}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <MapPin size={14} />
                                {college.location}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleSaveCollege(college.id)}
                            className={`text-gray-400 hover:text-[#f5a623] transition-colors ${
                              savedColleges.includes(college.id) ? 'text-[#f5a623]' : ''
                            }`}
                          >
                            <Bookmark size={20} fill={savedColleges.includes(college.id) ? '#f5a623' : 'none'} />
                          </button>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded">
                            {college.type}
                          </span>
                          <span className="text-sm font-semibold text-[#1a5d3a]">
                            {college.acceptanceRate}% Acceptance Rate
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Avg Net Price:</div>
                            <div className="text-lg font-bold text-gray-900">
                              ${college.tuitionInState.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Sticker Price:</div>
                            <div className="text-lg font-bold text-gray-900">
                              ${college.tuitionOutState.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Average ACT Composite:</div>
                            <div className="flex items-center gap-2">
                              <div className="text-base font-semibold text-gray-900">
                                {college.actRange.split('-')[0]}
                              </div>
                              <div className="flex-1 h-2 bg-gray-200 rounded-full relative">
                                <div 
                                  className="absolute left-0 top-0 h-full bg-[#1a5d3a] rounded-full"
                                  style={{ width: `${(parseInt(college.actRange.split('-')[0]) / 36) * 100}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-500">0 - 36</div>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Average SAT Composite:</div>
                            <div className="flex items-center gap-2">
                              <div className="text-base font-semibold text-gray-900">
                                {college.satRange.split('-')[0]}
                              </div>
                              <div className="flex-1 h-2 bg-gray-200 rounded-full relative">
                                <div 
                                  className="absolute left-0 top-0 h-full bg-[#1a5d3a] rounded-full"
                                  style={{ width: `${(parseInt(college.satRange.split('-')[0]) / 1600) * 100}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-500">0 - 1600</div>
                            </div>
                          </div>
                        </div>

                        <Button variant="outline" className="text-[#1a5d3a] border-[#1a5d3a] hover:bg-[#1a5d3a] hover:text-white">
                          Will you get accepted?
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-8">
                <button className="px-3 py-1 text-sm text-gray-500 hover:text-[#1a5d3a]">«</button>
                <button className="px-3 py-1 text-sm text-gray-500 hover:text-[#1a5d3a]">‹</button>
                <button className="px-3 py-1 text-sm bg-[#1a5d3a] text-white rounded">1</button>
                <button className="px-3 py-1 text-sm text-gray-700 hover:text-[#1a5d3a]">2</button>
                <button className="px-3 py-1 text-sm text-gray-700 hover:text-[#1a5d3a]">3</button>
                <button className="px-3 py-1 text-sm text-gray-500 hover:text-[#1a5d3a]">›</button>
                <button className="px-3 py-1 text-sm text-gray-500 hover:text-[#1a5d3a]">»</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CollegesPageNew;
