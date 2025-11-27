import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { scholarshipCategories } from '../data/mockData';
import { scholarshipsAPI } from '../services/api';
import { toast } from 'sonner';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { Search, ChevronDown, Bookmark, DollarSign } from 'lucide-react';

const ScholarshipsPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [scholarships, setScholarships] = useState([]);
  const [filteredScholarships, setFilteredScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedScholarships, setSavedScholarships] = useState([]);
  const [filters, setFilters] = useState({
    deadline: '',
    minAmount: '',
    renewable: false,
    category: '',
    searchQuery: ''
  });
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // Fetch scholarships from backend
  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        setLoading(true);
        const response = await scholarshipsAPI.getScholarships();
        setScholarships(response.scholarships || []);
        setFilteredScholarships(response.scholarships || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching scholarships:', err);
        setError('Failed to load scholarships. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  // Fetch user's saved scholarships
  useEffect(() => {
    const fetchSavedScholarships = async () => {
      if (isAuthenticated) {
        try {
          const saved = await scholarshipsAPI.getSavedScholarships();
          setSavedScholarships(saved.map(s => s.id));
        } catch (error) {
          console.error('Error fetching saved scholarships:', error);
        }
      }
    };

    fetchSavedScholarships();
  }, [isAuthenticated]);

  useEffect(() => {
    let filtered = scholarships;

    if (filters.category && filters.category !== 'All Scholarships') {
      filtered = filtered.filter(s => s.category === filters.category);
    }

    if (filters.renewable) {
      filtered = filtered.filter(s => s.renewable);
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query)
      );
    }

    setFilteredScholarships(filtered);
  }, [filters]);

  const clearFilters = () => {
    setFilters({
      deadline: '',
      minAmount: '',
      renewable: false,
      category: '',
      searchQuery: ''
    });
  };

  const toggleSaveScholarship = async (scholarshipId) => {
    if (!isAuthenticated) {
      // Show modal prompting user to log in
      const modal = document.createElement('div');
      modal.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 30px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); z-index: 10000; max-width: 400px; width: 90%;';
      modal.innerHTML = `
        <h3 style="font-size: 22px; font-weight: bold; color: #f5a623; margin-bottom: 16px;">Log In Required</h3>
        <p style="color: #4a5568; line-height: 1.6; margin-bottom: 20px;">Please log in to save scholarships to your list.</p>
        <div style="display: flex; gap: 10px;">
          <button onclick="window.location.href='/login'" style="flex: 1; background: #f5a623; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">Log In</button>
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
      const isSaved = savedScholarships.includes(scholarshipId);
      
      if (isSaved) {
        await scholarshipsAPI.unsaveScholarship(scholarshipId);
        setSavedScholarships(prev => prev.filter(id => id !== scholarshipId));
        toast.success('Scholarship removed from saved list');
      } else {
        await scholarshipsAPI.saveScholarship(scholarshipId);
        setSavedScholarships(prev => [...prev, scholarshipId]);
        toast.success('Scholarship saved successfully');
      }
    } catch (error) {
      console.error('Error saving/unsaving scholarship:', error);
      toast.error('Failed to update saved status. Please try again.');
    }
  };

  const handleStartApplying = (scholarshipName, deadline) => {
    console.log('Start Applying clicked:', scholarshipName);
    // Create a visible modal/notification instead of alert
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 30px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); z-index: 10000; max-width: 500px; width: 90%;';
    modal.innerHTML = `
      <h2 style="color: #1a5d3a; font-size: 24px; font-weight: bold; margin-bottom: 16px;">Start Your Application</h2>
      <p style="color: #333; margin-bottom: 12px; font-size: 18px;"><strong>${scholarshipName}</strong></p>
      <p style="color: #666; margin-bottom: 8px;">Deadline: <strong>${deadline}</strong></p>
      <p style="color: #666; margin-bottom: 20px;">You'll be redirected to the application portal where you can submit your documents and complete the application process.</p>
      <button onclick="this.parentElement.remove(); document.getElementById('modal-overlay').remove();" style="background: #f5a623; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%;">Got It!</button>
    `;
    const overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999;';
    overlay.onclick = () => { modal.remove(); overlay.remove(); };
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
  };

  const handleLearnMore = (scholarship) => {
    console.log('Learn More clicked:', scholarship.name);
    // Create a visible modal/notification instead of alert
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 30px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); z-index: 10000; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;';
    modal.innerHTML = `
      <h2 style="color: #1a5d3a; font-size: 24px; font-weight: bold; margin-bottom: 16px;">${scholarship.name}</h2>
      <div style="margin-bottom: 12px;">
        <strong style="color: #f5a623; font-size: 20px;">${scholarship.amount}</strong>
      </div>
      <p style="color: #666; margin-bottom: 8px;"><strong>Deadline:</strong> ${scholarship.deadline}</p>
      <p style="color: #666; margin-bottom: 8px;"><strong>Type:</strong> ${scholarship.type}</p>
      <p style="color: #666; margin-bottom: 8px;"><strong>Category:</strong> ${scholarship.category}</p>
      <p style="color: #333; margin: 16px 0;">${scholarship.description}</p>
      <div style="margin-top: 16px;">
        <strong style="color: #333;">Eligibility:</strong>
        <ul style="margin-top: 8px; padding-left: 20px; color: #666;">
          ${scholarship.eligibility.map(e => `<li>${e}</li>`).join('')}
        </ul>
      </div>
      <p style="color: #666; margin-top: 16px; padding: 12px; background: #f0f0f0; border-radius: 6px;">
        ${scholarship.renewable ? '✓ This is a renewable award.' : 'This is a one-time award.'}
      </p>
      <button onclick="this.parentElement.remove(); document.getElementById('modal-overlay').remove();" style="background: #1a5d3a; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%; margin-top: 20px;">Close</button>
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
      <Header />
      
      {/* Hero Section with Search */}
      <section className="relative bg-gradient-to-br from-amber-50 to-orange-50 py-16">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920" 
            alt="Students celebrating" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Browse Scholarships for College Students
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              The nation's largest scholarship database. Create a free account to see all of your 
              personalized matches and start applying today!
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
              <input
                type="text"
                placeholder="Search scholarships..."
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
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="bg-white rounded-md shadow-md border border-gray-200 p-5 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[#1a5d3a] hover:underline"
                  >
                    Clear all
                  </button>
                </div>

                {/* Application Deadline */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Application Deadline
                  </label>
                  <select
                    value={filters.deadline}
                    onChange={(e) => setFilters({ ...filters, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5d3a]/20 focus:border-[#1a5d3a]"
                  >
                    <option value="">Select Deadline</option>
                    <option value="1week">In less than 1 week</option>
                    <option value="2weeks">In less than 2 weeks</option>
                    <option value="1month">In less than 1 month</option>
                    <option value="3months">In less than 3 months</option>
                  </select>
                </div>

                {/* Minimum Award Amount */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Minimum Award Amount
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={filters.minAmount}
                    onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5d3a]/20 focus:border-[#1a5d3a]"
                  />
                </div>

                {/* Renewable */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.renewable}
                      onChange={(e) => setFilters({ ...filters, renewable: e.target.checked })}
                      className="w-4 h-4 text-[#1a5d3a] border-gray-300 rounded focus:ring-[#1a5d3a]"
                    />
                    <span className="text-sm text-gray-700">Renewable</span>
                    <span className="text-sm text-gray-500">({scholarships.filter(s => s.renewable).length})</span>
                  </label>
                </div>

                {/* Eligibility Section */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Eligibility</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5d3a]/20 focus:border-[#1a5d3a]">
                        <option value="">All Locations</option>
                        <option value="ca">California</option>
                        <option value="ny">New York</option>
                        <option value="tx">Texas</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <div className="space-y-2">
                        <a href="#" className="block text-sm text-[#1a5d3a] hover:underline">Female</a>
                        <a href="#" className="block text-sm text-[#1a5d3a] hover:underline">Male</a>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ethnicity</label>
                      <div className="space-y-2">
                        <a href="#" className="block text-sm text-[#1a5d3a] hover:underline">African American</a>
                        <a href="#" className="block text-sm text-[#1a5d3a] hover:underline">Hispanic-Latino</a>
                        <a href="#" className="block text-sm text-[#1a5d3a] hover:underline">Asian or Pacific Islander</a>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Level of Current Enrollment</label>
                      <div className="space-y-2">
                        <a href="#" className="block text-sm text-[#1a5d3a] hover:underline">High school senior</a>
                        <a href="#" className="block text-sm text-[#1a5d3a] hover:underline">College freshman</a>
                        <a href="#" className="block text-sm text-[#1a5d3a] hover:underline">College sophomore</a>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Other</label>
                      <div className="space-y-2">
                        <a href="#" className="block text-sm text-[#1a5d3a] hover:underline">First Generation</a>
                        <a href="#" className="block text-sm text-[#1a5d3a] hover:underline">Financial Need Required</a>
                        <a href="#" className="block text-sm text-[#1a5d3a] hover:underline">LGBTQIA</a>
                        <a href="#" className="block text-sm text-[#1a5d3a] hover:underline">Disability</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#f5a623]"></div>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-red-800 font-semibold mb-2">Error Loading Scholarships</p>
                  <p className="text-red-600">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Category Pills */}
              {!loading && !error && (
                <>
                  <div className="flex flex-wrap gap-2 mb-6">
                {scholarshipCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilters({ ...filters, category: cat.name })}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      filters.category === cat.name || (!filters.category && cat.name === 'All Scholarships')
                        ? 'bg-[#1a5d3a] text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-[#1a5d3a] hover:text-[#1a5d3a]'
                    }`}
                  >
                    {cat.name} <span className="text-xs opacity-75">({cat.count})</span>
                  </button>
                ))}
              </div>

              {/* Results Count */}
              <div className="mb-5 bg-white px-4 py-3 rounded-md shadow-sm border border-gray-200">
                <p className="text-sm font-medium text-gray-700">
                  Showing All Scholarships
                </p>
              </div>

              {/* Scholarship Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredScholarships.map((scholarship) => (
                  <div
                    key={scholarship.id}
                    className="bg-white rounded-md shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col"
                  >
                    {/* Award Amount Header */}
                    <div className="bg-gradient-to-br from-[#f5a623]/10 to-[#f5a623]/20 p-4 border-b border-[#f5a623]/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="text-[#f5a623]" size={24} />
                          <div className="text-2xl font-bold text-[#1a5d3a]">
                            {scholarship.amount.replace('Up to ', '')}
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleSaveScholarship(scholarship.id)}
                          className={`transition-colors ${savedScholarships.includes(scholarship.id) ? 'text-[#f5a623]' : 'text-gray-400 hover:text-[#f5a623]'}`}
                        >
                          <Bookmark size={20} fill={savedScholarships.includes(scholarship.id) ? '#f5a623' : 'none'} />
                        </button>
                      </div>
                    </div>

                    {/* Scholarship Details */}
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-gray-900 hover:text-[#1a5d3a] cursor-pointer mb-2 line-clamp-2">
                        {scholarship.name}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3">{scholarship.description}</p>
                      
                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-gray-700 min-w-[70px]">Deadline:</span>
                          <span className="text-gray-600">{scholarship.deadline}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-gray-700 min-w-[70px]">Type:</span>
                          <span className="text-gray-600">{scholarship.type}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          scholarship.renewable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {scholarship.renewable ? 'Renewable Award' : 'One Time Award'}
                        </span>
                      </div>

                      <div className="mt-auto">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleLearnMore(scholarship);
                            }}
                            className="flex-1 text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-md font-medium text-sm py-2 px-4 transition-colors cursor-pointer"
                          >
                            Learn More
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleStartApplying(scholarship.name, scholarship.deadline);
                            }}
                            className="flex-1 bg-[#f5a623] hover:bg-[#e09000] text-white rounded-md font-semibold text-sm py-2 px-4 transition-colors cursor-pointer"
                          >
                            Start Applying
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Information Section */}
              <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What are Scholarships for College Students?</h2>
                <p className="text-gray-700 mb-6">
                  Scholarships are a smart and convenient way to pay for your college education because they are money earned that you don't have to pay back. Scholarships can be awarded for various things, including just for attending college.
                </p>
                <p className="text-gray-700 mb-6">
                  Scholarships for college students will often require you to submit an essay, report card, or other proof of enrollment at a college. Some scholarships must be sent directly to your institution and will be used to cover tuition costs. Others are dispersed to you for your discretionary use and covering expenses.
                </p>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 mt-8">How Do I Qualify for Scholarships for College Students?</h3>
                <p className="text-gray-700 mb-6">
                  In general, if you're a student who is attending college or going to be attending college, you may be eligible for college student scholarships. All scholarships will have different requirements because different organizations, businesses, or people offer them.
                </p>

                <h3 className="text-xl font-bold text-gray-900 mb-3 mt-8">What Types of Scholarships Are There?</h3>
                <p className="text-gray-700 mb-4">
                  There are countless different types of scholarship opportunities for college students. Some common types of scholarship categories include:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Merit-based scholarships for college students</li>
                  <li>First-generation college student scholarships</li>
                  <li>College scholarships for Hispanic students</li>
                  <li>Scholarships for current college students</li>
                  <li>College scholarships for international students</li>
                </ul>

                <h3 className="text-xl font-bold text-gray-900 mb-3 mt-8">Let Student Signal Help You Find Scholarships</h3>
                <p className="text-gray-700">
                  Finding college student scholarships can be a lengthy process. You can start today by searching our extensive scholarship database and applying to as many scholarships as possible to build your financial aid package.
                </p>
              </div>

              {/* CTA */}
              <div className="mt-8 bg-[#1a5d3a] rounded-lg p-8 text-center text-white">
                <h3 className="text-2xl font-bold mb-4">Create a free account to see all your scholarship matches</h3>
                <Button size="lg" className="bg-[#f5a623] hover:bg-[#e09000] text-white font-semibold px-8">
                  Get Started
                </Button>
              </div>
              </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ScholarshipsPage;
