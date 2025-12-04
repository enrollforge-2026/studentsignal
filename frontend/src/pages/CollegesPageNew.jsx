import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { states, majorsList } from '../data/mockData';
import { collegesAPI } from '../services/api';
import { toast } from 'sonner';
import TopExperienceLayer from '../components/top/TopExperienceLayer';
import Footer from '../components/layout/Footer';
import LeadCaptureModal from '../components/LeadCaptureModal';
import { Button } from '../components/ui/button';
import { Search, Bookmark, MapPin, ChevronDown, SlidersHorizontal, X } from 'lucide-react';

const CollegesPageNew = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const initialSearch = searchParams.get('search') || '';
  
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);

  // Fetch colleges from backend
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setLoading(true);
        const response = await collegesAPI.getColleges({limit: 100});
        // Backend now returns flat UI schema directly
        setColleges(response.colleges || []);
        setFilteredColleges(response.colleges || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching colleges:', err);
        setError('Failed to load colleges. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  // Fetch user's saved colleges
  useEffect(() => {
    const fetchSavedColleges = async () => {
      if (isAuthenticated) {
        try {
          const saved = await collegesAPI.getSavedColleges();
          setSavedColleges(saved.map(c => c.ipedsId));
        } catch (error) {
          console.error('Error fetching saved colleges:', error);
        }
      }
    };

    fetchSavedColleges();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!colleges || colleges.length === 0) {
      setFilteredColleges([]);
      return;
    }

    let filtered = [...colleges];

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
        (c.name && c.name.toLowerCase().includes(query)) ||
        (c.short_name && c.short_name.toLowerCase().includes(query)) ||
        (c.location && c.location.toLowerCase().includes(query)) ||
        (c.majors && Array.isArray(c.majors) && c.majors.some(m => m.toLowerCase().includes(query)))
      );
    }

    // Sort
    if (sortBy === 'mostSelective') {
      filtered = [...filtered].sort((a, b) => (a.acceptance_rate || 0) - (b.acceptance_rate || 0));
    } else if (sortBy === 'leastSelective') {
      filtered = [...filtered].sort((a, b) => (b.acceptance_rate || 0) - (a.acceptance_rate || 0));
    } else if (sortBy === 'lowestNetPrice') {
      filtered = [...filtered].sort((a, b) => (a.tuition_in_state || 0) - (b.tuition_in_state || 0));
    }

    setFilteredColleges(filtered);
  }, [colleges, filters, sortBy]);

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

  const toggleSaveCollege = async (collegeId) => {
    if (!isAuthenticated) {
      // Show modal prompting user to log in
      const modal = document.createElement('div');
      modal.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 30px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); z-index: 10000; max-width: 400px; width: 90%;';
      modal.innerHTML = `
        <h3 style="font-size: 22px; font-weight: bold; color: #1a5d3a; margin-bottom: 16px;">Log In Required</h3>
        <p style="color: #4a5568; line-height: 1.6; margin-bottom: 20px;">Please log in to save colleges to your list.</p>
        <div style="display: flex; gap: 10px;">
          <button onclick="window.location.href='/login'" style="flex: 1; background: #1a5d3a; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">Log In</button>
          <button onclick="this.parentElement.parentElement.remove(); document.getElementById('modal-overlay').remove();" style="flex: 1; background: #e5e7eb; color: #374151; padding: 12px 24px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">Cancel</button>
        </div>
      `;
      
      const overlay = document.createElement('div');
      overlay.id = 'modal-overlay';
      overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999;';
      overlay.onclick = () => { modal.remove(); overlay.remove(); };
      
      document.body.appendChild(overlay);
      document.body.appendChild(modal);
      return;
    }

    try {
      const isSaved = savedColleges.includes(collegeId);
      
      if (isSaved) {
        await collegesAPI.unsaveCollege(collegeId);
        setSavedColleges(prev => prev.filter(id => id !== collegeId));
        toast.success('College removed from saved list');
      } else {
        await collegesAPI.saveCollege(collegeId);
        setSavedColleges(prev => [...prev, collegeId]);
        toast.success('College saved successfully');
      }
    } catch (error) {
      console.error('Error saving/unsaving college:', error);
      toast.error('Failed to update saved status. Please try again.');
    }
  };

  const handleWillYouGetAccepted = (collegeName) => {
    // Create a visible modal/notification instead of alert
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 30px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); z-index: 10000; max-width: 500px; width: 90%;';
    modal.innerHTML = `
      <h3 style="font-size: 22px; font-weight: bold; color: #1a5d3a; margin-bottom: 16px;">Check Your Admission Chances</h3>
      <p style="color: #4a5568; line-height: 1.6; margin-bottom: 20px;">Assess your probability of acceptance to <strong>${collegeName}</strong> based on your academic profile, test scores, and extracurricular activities.</p>
      <button onclick="this.parentElement.remove(); document.getElementById('modal-overlay').remove();" style="background: #1a5d3a; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%; transition: background 0.2s;" onmouseover="this.style.background='#2d8659'" onmouseout="this.style.background='#1a5d3a'">Got It!</button>
    `;
    
    const overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999;';
    overlay.onclick = () => { modal.remove(); overlay.remove(); };
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopExperienceLayer />
      
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
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden fixed bottom-20 right-4 z-[9999] bg-[#1a5d3a] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-[#2d8659] transition-colors"
            >
              <SlidersHorizontal size={20} />
              <span className="font-medium">Filters</span>
            </button>

            {/* Mobile Filter Overlay */}
            {showMobileFilters && (
              <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)}>
                <aside 
                  className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
                    <h3 className="font-semibold text-gray-900 text-lg">Filters</h3>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="p-5">
                    {/* Clear all button */}
                    <button
                      onClick={() => {
                        clearFilters();
                        setShowMobileFilters(false);
                      }}
                      className="w-full mb-4 px-4 py-2 text-sm text-[#1a5d3a] border border-[#1a5d3a] rounded-md hover:bg-[#1a5d3a] hover:text-white transition-colors"
                    >
                      Clear all
                    </button>

                    {/* Location */}
                    <div className="mb-5 pb-5 border-b border-gray-200">
                      <label className="block text-sm font-semibold text-gray-900 mb-3">Location</label>
                      <div className="space-y-2.5 max-h-48 overflow-y-auto pr-2">
                        {states.slice(0, 10).map((state) => (
                          <label key={state} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
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

                    {/* Apply button */}
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="w-full px-4 py-3 bg-[#1a5d3a] text-white rounded-md hover:bg-[#2d8659] transition-colors font-medium"
                    >
                      Apply Filters
                    </button>
                  </div>
                </aside>
              </div>
            )}

            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="bg-white rounded-md shadow-md border border-gray-200 p-5 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
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
                <div className="mb-5 pb-5 border-b border-gray-200">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Location</label>
                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-2">
                    {states.slice(0, 10).map((state) => (
                      <label key={state} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
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
                <div className="mb-5 pb-5 border-b border-gray-200">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Level of Institution</label>
                  <div className="space-y-2.5">
                    <label className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-[#1a5d3a] border-gray-300 rounded focus:ring-[#1a5d3a]"
                        />
                        <span className="text-sm text-gray-700">4 Year</span>
                      </div>
                      <span className="text-xs text-gray-500 font-medium">2,689</span>
                    </label>
                    <label className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-[#1a5d3a] border-gray-300 rounded focus:ring-[#1a5d3a]"
                        />
                        <span className="text-sm text-gray-700">2 Year</span>
                      </div>
                      <span className="text-xs text-gray-500 font-medium">1,042</span>
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
              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1a5d3a]"></div>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-red-800 font-semibold mb-2">Error Loading Colleges</p>
                  <p className="text-red-600">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Sort and Count */}
              {!loading && !error && (
                <>
                  <div className="flex items-center justify-between mb-6 bg-white px-4 py-3 rounded-md shadow-sm border border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Showing {filteredColleges.length} Colleges
                      </p>
                    </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5d3a]/20 focus:border-[#1a5d3a] bg-white"
                >
                  <option value="mostPopular">Most Popular</option>
                  <option value="mostSelective">Most Selective to Least Selective</option>
                  <option value="leastSelective">Least Selective to Most Selective</option>
                  <option value="lowestNetPrice">Lowest to Highest Net Price</option>
                  <option value="lowestSticker">Lowest to Highest Sticker Price</option>
                </select>
              </div>

              {/* College Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredColleges.map((college) => (
                  <div
                    key={college.id}
                    className="bg-white rounded-md shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col"
                  >
                    {/* College Image */}
                    <div className="relative h-48">
                      <img
                        src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80"
                        alt={college.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => toggleSaveCollege(college.ipedsId)}
                        className={`absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors ${
                          savedColleges.includes(college.ipedsId) ? 'text-[#f5a623]' : 'text-gray-400'
                        }`}
                      >
                        <Bookmark size={18} fill={savedColleges.includes(college.ipedsId) ? '#f5a623' : 'none'} />
                      </button>
                    </div>

                    {/* College Details */}
                    <div className="p-4 flex flex-col flex-1">
                      <Link to={`/college/${college.ipedsId || college.slug}`}>
                        <h3 className="text-base font-bold text-gray-900 hover:text-[#1a5d3a] cursor-pointer mb-1 line-clamp-2 leading-tight">
                          {college.name}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
                        <MapPin size={12} />
                        <span>{college.city}, {college.state}</span>
                      </div>

                      <div className="flex items-center gap-2 mb-3 text-xs">
                        <span className="text-gray-700 font-medium">
                          {college.publicPrivate}
                        </span>
                        <span className="text-gray-400">|</span>
                        <span className="font-bold text-[#1a5d3a]">
                          {college.acceptanceRate || 'N/A'}% Acceptance Rate
                        </span>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-gray-600">In-State Tuition:</span>
                          <span className="text-base font-bold text-gray-900">
                            ${(college.inStateTuition || 0).toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-gray-600">Avg Net Price:</span>
                          <span className="text-base font-bold text-gray-900">
                            {college.avgNetPrice ? `$${college.avgNetPrice.toLocaleString()}` : 'N/A'}
                          </span>
                        </div>
                      </div>

                      {(college.actAvg || college.satAvg) && (
                        <div className="space-y-2 mb-3">
                          {college.actAvg && (
                            <div>
                              <div className="flex items-baseline justify-between mb-1">
                                <span className="text-xs text-gray-600">Average ACT Composite:</span>
                                <span className="text-sm font-bold text-gray-900">
                                  {college.actAvg}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">0</span>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full relative overflow-hidden">
                                  <div 
                                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#1a5d3a] to-[#2d8659] rounded-full"
                                    style={{ width: `${(college.actAvg / 36) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500">36</span>
                              </div>
                            </div>
                          )}

                          {college.satAvg && (
                            <div>
                              <div className="flex items-baseline justify-between mb-1">
                                <span className="text-xs text-gray-600">Average SAT Composite:</span>
                                <span className="text-sm font-bold text-gray-900">
                                  {college.satAvg}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">0</span>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full relative overflow-hidden">
                                  <div 
                                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#1a5d3a] to-[#2d8659] rounded-full"
                                    style={{ width: `${(college.satAvg / 1600) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500">1600</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-auto pt-2 border-t border-gray-100">
                        <div className="flex gap-2">
                          <Link to={`/college/${college.id}`} className="flex-1">
                            <Button 
                              variant="outline" 
                              className="w-full text-gray-700 border-gray-300 hover:bg-gray-50 rounded-md font-medium text-sm py-2"
                            >
                              Learn More
                            </Button>
                          </Link>
                          <Button 
                            onClick={() => {
                              setSelectedCollege(college);
                              setLeadModalOpen(true);
                            }}
                            className="flex-1 bg-[#1a5d3a] hover:bg-[#155d35] text-white rounded-md font-semibold text-sm py-2"
                          >
                            Request Info
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-1 mt-8">
                <button className="px-3 py-2 text-sm text-gray-500 hover:text-[#1a5d3a] hover:bg-gray-100 rounded-md transition-colors">«</button>
                <button className="px-3 py-2 text-sm text-gray-500 hover:text-[#1a5d3a] hover:bg-gray-100 rounded-md transition-colors">‹</button>
                <button className="px-4 py-2 text-sm bg-[#1a5d3a] text-white rounded-md font-medium">1</button>
                <button className="px-4 py-2 text-sm text-gray-700 hover:text-[#1a5d3a] hover:bg-gray-100 rounded-md transition-colors">2</button>
                <button className="px-4 py-2 text-sm text-gray-700 hover:text-[#1a5d3a] hover:bg-gray-100 rounded-md transition-colors">3</button>
                <button className="px-3 py-2 text-sm text-gray-500 hover:text-[#1a5d3a] hover:bg-gray-100 rounded-md transition-colors">›</button>
                <button className="px-3 py-2 text-sm text-gray-500 hover:text-[#1a5d3a] hover:bg-gray-100 rounded-md transition-colors">»</button>
              </div>
              </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Lead Capture Modal */}
      {selectedCollege && (
        <LeadCaptureModal
          isOpen={leadModalOpen}
          onClose={() => {
            setLeadModalOpen(false);
            setSelectedCollege(null);
          }}
          college={selectedCollege}
        />
      )}
    </div>
  );
};

export default CollegesPageNew;
