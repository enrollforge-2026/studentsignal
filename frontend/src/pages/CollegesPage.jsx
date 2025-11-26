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
  ChevronDown,
  Sparkles
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
    <div className="min-h-screen flex flex-col bg-sand-light">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Banner */}
        <div className="bg-emerald relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-10 right-20 w-40 h-40 bg-turquoise/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-32 h-32 bg-lavender/10 rounded-full blur-3xl"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Find Your <span className="text-gradient bg-gradient-to-r from-tangerine to-lavender">Perfect College</span>
            </h1>
            <p className="text-sand/90 mb-10 max-w-2xl text-lg">
              Explore thousands of colleges with detailed information, reviews, and direct admission opportunities.
            </p>
            
            {/* Search bar */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
                <Input
                  type="text"
                  placeholder="Search by college name, location, or major..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 py-7 text-lg rounded-2xl border-0 shadow-lg focus:ring-2 focus:ring-turquoise"
                />
              </div>
              <Button 
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="bg-white text-emerald hover:bg-sand px-8 py-7 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                <SlidersHorizontal size={20} className="mr-2" />
                Filters
                <ChevronDown size={16} className={`ml-2 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-white border-b border-sand-dark py-8 animate-slideUp">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* State filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">State</label>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="rounded-xl border-2 border-sand-dark py-3">
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
                  <label className="block text-sm font-bold text-gray-700 mb-3">School Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="rounded-xl border-2 border-sand-dark py-3">
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
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Tuition: <span className="text-tangerine">${tuitionRange[0].toLocaleString()}</span> - <span className="text-tangerine">${tuitionRange[1].toLocaleString()}</span>
                  </label>
                  <Slider
                    value={tuitionRange}
                    onValueChange={setTuitionRange}
                    max={60000}
                    step={1000}
                    className="mt-6"
                  />
                </div>

                {/* Direct admission filter */}
                <div className="flex items-center gap-3 pt-8">
                  <Checkbox
                    id="directAdmission"
                    checked={directAdmissionOnly}
                    onCheckedChange={setDirectAdmissionOnly}
                    className="border-2 border-lavender data-[state=checked]:bg-lavender"
                  />
                  <label htmlFor="directAdmission" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Sparkles size={16} className="text-lavender" />
                    Direct Admission Available
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Results header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-gray-600">
                <span className="font-extrabold text-emerald text-2xl">{filteredColleges.length}</span>
                <span className="ml-2">colleges found</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-emerald text-white shadow-glow-emerald' : 'bg-white text-gray-600 hover:bg-sand'}`}
              >
                <Grid3X3 size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-emerald text-white shadow-glow-emerald' : 'bg-white text-gray-600 hover:bg-sand'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* College cards */}
          <div className={`grid gap-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredColleges.map((college, index) => (
              <div
                key={college.id}
                className={`bg-white rounded-3xl shadow-lg border border-sand overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${
                  viewMode === 'list' ? 'flex' : ''
                } ${
                  index % 3 === 0 ? 'hover:shadow-glow-emerald' :
                  index % 3 === 1 ? 'hover:shadow-glow-turquoise' :
                  'hover:shadow-glow-lavender'
                }`}
              >
                {/* Image */}
                <div className={`relative ${viewMode === 'list' ? 'w-56 flex-shrink-0' : 'h-52'}`}>
                  <img
                    src={college.image}
                    alt={college.name}
                    className={`w-full object-cover ${viewMode === 'list' ? 'h-full' : 'h-52'}`}
                  />
                  <button
                    onClick={() => toggleSaveCollege(college.id)}
                    className="absolute top-4 right-4 p-2.5 bg-white/95 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-110"
                  >
                    <Heart 
                      size={20} 
                      className={savedColleges.includes(college.id) ? 'fill-tangerine text-tangerine' : 'text-gray-400'} 
                    />
                  </button>
                  {college.directAdmission && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-lavender to-turquoise text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <Sparkles size={12} />
                      Direct Admission
                    </div>
                  )}
                  <div className={`absolute bottom-4 right-4 text-white text-sm font-extrabold px-3 py-1.5 rounded-xl ${
                    index % 3 === 0 ? 'bg-emerald' :
                    index % 3 === 1 ? 'bg-turquoise' :
                    'bg-lavender'
                  }`}>
                    {college.rating}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Link to={`/college/${college.id}`}>
                        <h3 className="font-extrabold text-lg text-gray-900 hover:text-emerald transition-colors">
                          {college.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                        <MapPin size={14} />
                        <span>{college.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-5 text-sm">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-turquoise" />
                      <span className="text-gray-600">{college.enrollment.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap size={16} className="text-lavender" />
                      <span className="text-gray-600">{college.acceptanceRate}% accept</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-tangerine" />
                      <span className="text-gray-600">${college.tuitionInState.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-emerald" />
                      <span className="text-gray-600">#{college.ranking}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-5">
                    {college.features.slice(0, 3).map((feature, idx) => (
                      <span 
                        key={idx}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                          idx === 0 ? 'bg-emerald/10 text-emerald' :
                          idx === 1 ? 'bg-turquoise/10 text-turquoise' :
                          'bg-lavender/10 text-lavender'
                        }`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Action */}
                  <Link to={`/college/${college.id}`}>
                    <Button className={`w-full mt-6 font-bold rounded-xl py-3 transition-all ${
                      index % 3 === 0 ? 'bg-emerald hover:bg-emerald-dark hover:shadow-glow-emerald' :
                      index % 3 === 1 ? 'bg-turquoise hover:bg-turquoise-dark hover:shadow-glow-turquoise' :
                      'bg-lavender hover:bg-lavender-dark hover:shadow-glow-lavender'
                    } text-white`}>
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredColleges.length === 0 && (
            <div className="text-center py-20">
              <GraduationCap size={56} className="mx-auto text-sand-dark mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">No colleges found</h3>
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
