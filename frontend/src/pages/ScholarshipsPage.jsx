import React, { useState, useEffect } from 'react';
import { scholarships, scholarshipCategories } from '../data/mockData';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { Search, ChevronDown, Bookmark, DollarSign } from 'lucide-react';

const ScholarshipsPage = () => {
  const [filteredScholarships, setFilteredScholarships] = useState(scholarships);
  const [filters, setFilters] = useState({
    deadline: '',
    minAmount: '',
    renewable: false,
    category: '',
    searchQuery: ''
  });
  const [showMoreFilters, setShowMoreFilters] = useState(false);

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
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
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
              {/* Search Bar */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search scholarships..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5d3a]/20 focus:border-[#1a5d3a]"
                  />
                </div>
              </div>

              {/* Category Pills */}
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
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{filteredScholarships.length}</span> Scholarships
                </p>
              </div>

              {/* Scholarship Cards */}
              <div className="space-y-4">
                {filteredScholarships.map((scholarship) => (
                  <div
                    key={scholarship.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-6">
                      {/* Award Amount */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 bg-[#f5a623]/10 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <DollarSign className="mx-auto text-[#f5a623] mb-1" size={20} />
                            <div className="text-lg font-bold text-[#1a5d3a]">
                              {scholarship.amount.replace('Up to ', '')}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Scholarship Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900 hover:text-[#1a5d3a] cursor-pointer">
                            {scholarship.name}
                          </h3>
                          <button className="text-gray-400 hover:text-[#f5a623] transition-colors">
                            <Bookmark size={20} />
                          </button>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{scholarship.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                          <div>
                            <span className="font-medium">Deadline:</span> {scholarship.deadline}
                          </div>
                          <div>
                            <span className="font-medium">Type:</span> {scholarship.type}
                          </div>
                          <div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              scholarship.renewable 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {scholarship.renewable ? 'Renewable Award' : 'One Time Award'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Button className="bg-[#f5a623] hover:bg-[#e09000] text-white">
                            Start Applying
                          </Button>
                          <span className="text-sm text-gray-500">Application Required</span>
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
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ScholarshipsPage;
