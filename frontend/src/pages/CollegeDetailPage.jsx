import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TopExperienceLayer from '../components/top/TopExperienceLayer';
import Footer from '../components/layout/Footer';
import LeadCaptureModal from '../components/LeadCaptureModal';
import { collegesAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { 
  formatCurrency, 
  formatPercentage, 
  formatTestScore, 
  formatLocation,
  getBadgeColors 
} from '../utils/formatters';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  MapPin,
  GraduationCap,
  DollarSign,
  Users,
  Star,
  Heart,
  Share2,
  ExternalLink,
  Award,
  BookOpen,
  Building2,
  CheckCircle,
  Calendar,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
const CollegeDetailPage = () => {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: college.name,
      text: `Check out ${college.name} on Student Signal`,
      url: window.location.href
    };

    try {
      // Try native share API (works on mobile)
      if (navigator.share) {
        await navigator.share(shareData);
        return; // Success, exit early
      }
    } catch (error) {
      // User cancelled share or share failed
      if (error.name === 'AbortError') {
        return; // User cancelled, don't show error
      }
    }

    // Fallback for desktop: copy URL to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    } catch (clipboardError) {
      // Clipboard API not available or permission denied
      // Show manual copy prompt
      const url = window.location.href;
      prompt('Copy this link:', url);
    }
  };

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        setLoading(true);
        const data = await collegesAPI.getCollege(id);
        setCollege(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching college:', err);
        setError('Failed to load college details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCollege();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopExperienceLayer />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1a5d3a] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading college details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopExperienceLayer />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'College not found'}
            </h1>
            <Link to="/colleges">
              <Button className="bg-[#1a5d3a] hover:bg-[#2d8659]">Browse Colleges</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden">
      <div className="min-h-screen flex flex-col bg-gray-50">
        <TopExperienceLayer />
        
        <main className="flex-grow">
        {/* Hero section */}
        <div className="w-full h-[260px] md:h-[400px] overflow-hidden relative">
          <img
            src={college.image}
            alt={college.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          
          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
            <div className="w-full max-w-6xl mx-auto px-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {college.publicPrivate && (
                      <span className="bg-[#1a5d3a] text-white text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full">
                        {college.publicPrivate}
                      </span>
                    )}
                    {college.degreeLevel && (
                      <span className="text-white/80 text-xs sm:text-sm whitespace-nowrap">
                        {college.degreeLevel}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 truncate">{college.name}</h1>
                  <div className="flex flex-wrap items-center gap-2 text-white/90 text-sm">
                    <MapPin size={16} className="flex-shrink-0" />
                    <span className="truncate">{college.city}, {college.state}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 w-full md:flex-row md:w-auto md:gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full md:w-auto flex-shrink-0 bg-white/10 border-white/30 text-white hover:bg-white hover:text-gray-900 text-xs md:text-sm justify-center"
                    onClick={() => setIsSaved(!isSaved)}
                  >
                    <Heart size={14} className={`mr-1 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full md:w-auto flex-shrink-0 bg-white/10 border-white/30 text-white hover:bg-white hover:text-gray-900 text-xs md:text-sm justify-center"
                    onClick={handleShare}
                  >
                    <Share2 size={14} className="mr-1" />
                    Share
                  </Button>
                  {college.website && college.website !== '#' && (
                    <Button 
                      size="sm" 
                      className="w-full md:w-auto flex-shrink-0 bg-[#f5a623] hover:bg-[#e09000] text-white text-xs md:text-sm justify-center"
                      onClick={() => window.open(college.website, '_blank')}
                    >
                      <ExternalLink size={14} className="mr-1" />
                      Visit Website
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="bg-white border-b border-gray-200">
          <div className="w-full max-w-6xl mx-auto px-4 py-4 sm:py-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-6">
              {college.acceptanceRate && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-[#1a5d3a] mb-1">
                    <GraduationCap size={20} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{college.acceptanceRate}%</p>
                  <p className="text-sm text-gray-500">Acceptance Rate</p>
                </div>
              )}
              {college.inStateTuition && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-[#1a5d3a] mb-1">
                    <DollarSign size={20} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">${college.inStateTuition.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">In-State Tuition</p>
                </div>
              )}
              {college.satAvg && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-[#1a5d3a] mb-1">
                    <BookOpen size={20} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{college.satAvg}</p>
                  <p className="text-sm text-gray-500">SAT Average</p>
                </div>
              )}
              {college.actAvg && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-[#1a5d3a] mb-1">
                    <BookOpen size={20} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{college.actAvg}</p>
                  <p className="text-sm text-gray-500">ACT Average</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="w-full max-w-6xl mx-auto px-4 py-4 sm:py-8">
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Main content area */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start bg-white border border-gray-200 rounded-xl p-1 mb-4 sm:mb-6 overflow-x-auto flex-nowrap">
                  <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
                  <TabsTrigger value="academics" className="rounded-lg">Academics</TabsTrigger>
                  <TabsTrigger value="admissions" className="rounded-lg">Admissions</TabsTrigger>
                  <TabsTrigger value="cost" className="rounded-lg">Cost & Aid</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">About {college.name}</h2>
                    <p className="text-gray-600 leading-relaxed">
                      {college.name} is a {college.publicPrivate} {college.degreeLevel} institution located in {college.city}, {college.state}.
                      {college.acceptanceRate && ` With an acceptance rate of ${college.acceptanceRate}%, `}
                      {college.name} offers a comprehensive range of academic programs.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Student Demographics</h2>
                    <div className="w-full grid grid-cols-1 gap-6 md:grid-cols-2 overflow-x-hidden">
                      <div className="w-full max-w-full overflow-hidden">
                        <h3 className="text-lg font-semibold mb-4 text-center">Gender Distribution</h3>
                        <ResponsiveContainer width="100%" height={250} className="w-full h-auto">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Male', value: 49, color: '#1a5d3a' },
                                { name: 'Female', value: 51, color: '#f5a623' }
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              fill="#8884d8"
                              paddingAngle={5}
                              dataKey="value"
                              label
                            >
                              <Cell fill="#1a5d3a" />
                              <Cell fill="#f5a623" />
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="w-full max-w-full overflow-hidden">
                        <h3 className="text-lg font-semibold mb-4 text-center">Ethnic Diversity</h3>
                        <ResponsiveContainer width="100%" height={250} className="w-full h-auto">
                          <BarChart data={[
                            { name: 'White', value: 35, fill: '#1a5d3a' },
                            { name: 'Asian', value: 25, fill: '#2d8659' },
                            { name: 'Hispanic', value: 18, fill: '#4a9d6f' },
                            { name: 'Black', value: 12, fill: '#f5a623' },
                            { name: 'Other', value: 10, fill: '#e09000' }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#1a5d3a" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Campus Life</h2>
                    <p className="text-gray-600 text-sm">
                      Campus features and amenities information is not currently available for this institution.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="academics" className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Majors</h2>
                    <p className="text-gray-600 text-sm">
                      Major program information is not currently available. Please visit the college website for detailed academic offerings.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Graduation Rates Over Time</h2>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={[
                        { year: '4 Years', rate: 85 },
                        { year: '5 Years', rate: 93 },
                        { year: '6 Years', rate: college.graduationRate }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="rate" fill="#1a5d3a" name="Graduation Rate %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Academic Stats</h2>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Graduation Rate</span>
                          <span className="text-sm font-semibold">{college.graduationRate}%</span>
                        </div>
                        <Progress value={college.graduationRate} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Student-Faculty Ratio</span>
                          <span className="text-sm font-semibold">18:1</span>
                        </div>
                        <Progress value={70} className="h-2" />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="admissions" className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Admissions Requirements</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">SAT Range</p>
                        <p className="text-lg font-bold text-gray-900">{college.satRange}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">ACT Range</p>
                        <p className="text-lg font-bold text-gray-900">{college.actRange}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Acceptance Rate</p>
                        <p className="text-lg font-bold text-gray-900">{college.acceptanceRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Application Deadline</p>
                        <p className="text-lg font-bold text-gray-900">January 15</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Acceptance Rate Trend</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={[
                        { year: '2020', rate: college.acceptanceRate + 1 },
                        { year: '2021', rate: college.acceptanceRate + 0.5 },
                        { year: '2022', rate: college.acceptanceRate },
                        { year: '2023', rate: college.acceptanceRate - 0.3 },
                        { year: '2024', rate: college.acceptanceRate - 0.5 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="rate" stroke="#1a5d3a" strokeWidth={3} name="Acceptance Rate %" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {college.directAdmission && (
                    <div className="bg-[#1a5d3a] rounded-2xl p-6 text-white">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle size={24} />
                        <h2 className="text-xl font-bold">Direct Admission Available</h2>
                      </div>
                      <p className="text-white/90 mb-4">
                        Skip the application process! Create a Student Signal Profile and get admitted directly based on your academic credentials.
                      </p>
                      <Link to="/signup">
                        <Button className="bg-[#f5a623] hover:bg-[#e09000] text-white">
                          Get Direct Admission
                        </Button>
                      </Link>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="cost" className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Cost of Attendance</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      {college.inStateTuition && (
                        <div className="bg-[#1a5d3a]/5 rounded-xl p-4">
                          <p className="text-sm text-gray-500 mb-1">In-State Tuition</p>
                          <p className="text-2xl font-bold text-[#1a5d3a]">${college.inStateTuition.toLocaleString()}</p>
                          <p className="text-xs text-gray-500 mt-1">per year</p>
                        </div>
                      )}
                      {college.outStateTuition && (
                        <div className="bg-[#f5a623]/10 rounded-xl p-4">
                          <p className="text-sm text-gray-500 mb-1">Out-of-State Tuition</p>
                          <p className="text-2xl font-bold text-[#f5a623]">${college.outStateTuition.toLocaleString()}</p>
                          <p className="text-xs text-gray-500 mt-1">per year</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Ready to Apply?</h3>
                <div className="space-y-3">
                  <Button className="w-full bg-[#f5a623] hover:bg-[#e09000] text-white font-semibold">
                    Apply Now
                  </Button>
                  <Button 
                    onClick={() => setLeadModalOpen(true)}
                    variant="outline" 
                    className="w-full border-[#1a5d3a] text-[#1a5d3a] hover:bg-[#1a5d3a] hover:text-white"
                  >
                    Request Info
                  </Button>
                </div>
              </div>

              {/* Contact card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {college.website && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Globe size={18} className="text-[#1a5d3a]" />
                      <a href={college.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-[#1a5d3a]">
                        {college.website.replace('https://', '').replace('http://', '')}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Important dates */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Important Dates</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-[#f5a623]" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Early Decision</p>
                      <p className="text-xs text-gray-500">November 1</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-[#f5a623]" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Regular Decision</p>
                      <p className="text-xs text-gray-500">January 15</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-[#f5a623]" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Financial Aid</p>
                      <p className="text-xs text-gray-500">March 2</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Lead Capture Modal */}
      {college && (
        <LeadCaptureModal
          isOpen={leadModalOpen}
          onClose={() => setLeadModalOpen(false)}
          college={college}
        />
      )}
      </div>
    </div>
  );
};

export default CollegeDetailPage;
