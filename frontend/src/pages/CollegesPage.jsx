import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { colleges, states } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Checkbox } from '../components/ui/checkbox';
import { 
  Search, 
  MapPin, 
  GraduationCap, 
  DollarSign, 
  Users,
  Star,
  Heart,
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronDown
} from 'lucide-react';

const CollegesPage = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedState, setSelectedState] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [tuitionRange, setTuitionRange] = useState([0, 60000]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [directAdmissionOnly, setDirectAdmissionOnly] = useState(false);
  const [savedColleges, setSavedColleges] = useState([]);

  const filteredColleges = useMemo(() => {
    return colleges.filter(college => {
      const matchesSearch = college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           college.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           college.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesState = !selectedState || college.state === selectedState;
      const matchesType = !selectedType || college.type === selectedType;
      const matchesTuition = college.tuitionInState >= tuitionRange[0] && college.tuitionInState <= tuitionRange[1];
      const matchesDirectAdmission = !directAdmissionOnly || college.directAdmission;
      
      return matchesSearch && matchesState && matchesType && matchesTuition && matchesDirectAdmission;
    });
  }, [searchQuery, selectedState, selectedType, tuitionRange, directAdmissionOnly]);

  const toggleSaveCollege = (collegeId) => {
    setSavedColleges(prev => 
      prev.includes(collegeId) 
        ? prev.filter(id => id !== collegeId)
        : [...prev, collegeId]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Banner */}
        <div className="bg-[#1a5d3a] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Find Your Perfect College
            </h1>
            <p className="text-white/80 mb-8 max-w-2xl">
              Explore thousands of colleges with detailed information, reviews, and direct admission opportunities.
            </p>
            
            {/* Search bar */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search by college name, location, or major..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-6 text-lg rounded-xl border-0"
                />
              </div>
              <Button 
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="bg-white text-[#1a5d3a] hover:bg-gray-100 px-6 py-6 rounded-xl font-semibold"
              >
                <SlidersHorizontal size={20} className="mr-2" />
                Filters
                <ChevronDown size={16} className={`ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-white border-b border-gray-200 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* State filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger>
                      <SelectValue placeholder="All States" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All States</SelectItem>
                      {states.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Type filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">School Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value="Public">Public</SelectItem>
                      <SelectItem value="Private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tuition range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tuition: ${tuitionRange[0].toLocaleString()} - ${tuitionRange[1].toLocaleString()}
                  </label>
                  <Slider
                    value={tuitionRange}
                    onValueChange={setTuitionRange}
                    max={60000}
                    step={1000}
                    className="mt-4"
                  />
                </div>

                {/* Direct admission filter */}
                <div className="flex items-center gap-2 pt-6">
                  <Checkbox
                    id="directAdmission"
                    checked={directAdmissionOnly}
                    onCheckedChange={setDirectAdmissionOnly}
                  />
                  <label htmlFor="directAdmission" className="text-sm font-medium text-gray-700">
                    Direct Admission Available
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{filteredColleges.length}</span> colleges found
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[#1a5d3a] text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <Grid3X3 size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[#1a5d3a] text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* College cards */}
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredColleges.map(college => (
              <div
                key={college.id}
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Image */}
                <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-48'}`}>
                  <img
                    src={college.image}
                    alt={college.name}
                    className={`w-full object-cover ${viewMode === 'list' ? 'h-full' : 'h-48'}`}
                  />
                  <button
                    onClick={() => toggleSaveCollege(college.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
                  >
                    <Heart 
                      size={18} 
                      className={savedColleges.includes(college.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'} 
                    />
                  </button>
                  {college.directAdmission && (
                    <div className="absolute top-3 left-3 bg-[#1a5d3a] text-white text-xs font-semibold px-2 py-1 rounded-full">
                      Direct Admission
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 bg-[#f5a623] text-white text-sm font-bold px-2 py-1 rounded">
                    {college.rating}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-grow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Link to={`/college/${college.id}`}>
                        <h3 className="font-bold text-lg text-gray-900 hover:text-[#1a5d3a] transition-colors">
                          {college.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                        <MapPin size={14} />
                        <span>{college.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-gray-400" />
                      <span className="text-gray-600">{college.enrollment.toLocaleString()} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap size={16} className="text-gray-400" />
                      <span className="text-gray-600">{college.acceptanceRate}% accept</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-gray-400" />
                      <span className="text-gray-600">${college.tuitionInState.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-gray-400" />
                      <span className="text-gray-600">#{college.ranking} rank</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {college.features.slice(0, 3).map((feature, idx) => (
                      <span 
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Action */}
                  <Link to={`/college/${college.id}`}>
                    <Button className="w-full mt-4 bg-[#1a5d3a] hover:bg-[#15472d] text-white font-semibold">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredColleges.length === 0 && (
            <div className="text-center py-16">
              <GraduationCap size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No colleges found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CollegesPage;
