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
            src={college.imageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80'}
            alt={`${college.name} campus`}
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
                      <span className={`${getBadgeColors(college.publicPrivate).bg} ${getBadgeColors(college.publicPrivate).text} text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full`}>
                        {college.publicPrivate}
                      </span>
                    )}
                    {college.degreeLevel && (
                      <span className="bg-white/20 text-white text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                        {college.degreeLevel}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 truncate">{college.name}</h1>
                  <div className="flex flex-wrap items-center gap-2 text-white/90 text-sm">
                    <MapPin size={16} className="flex-shrink-0" />
                    <span className="truncate">{formatLocation(college.city, college.state)}</span>
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
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-[#1a5d3a] mb-1">
                  <GraduationCap size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(college.acceptanceRate)}</p>
                <p className="text-sm text-gray-500">Acceptance Rate</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-[#1a5d3a] mb-1">
                  <DollarSign size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(college.inStateTuition)}</p>
                <p className="text-sm text-gray-500">In-State Tuition</p>
              </div>
              {(college.satAvg || college.actAvg) && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-[#1a5d3a] mb-1">
                    <BookOpen size={20} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {college.satAvg ? formatTestScore(college.satAvg) : formatTestScore(college.actAvg)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {college.satAvg ? 'SAT Average' : 'ACT Average'}
                  </p>
                </div>
              )}
              {college.avgNetPrice && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-[#1a5d3a] mb-1">
                    <DollarSign size={20} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(college.avgNetPrice)}</p>
                  <p className="text-sm text-gray-500">Avg Net Price</p>
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
                      {college.name} is a {college.publicPrivate} {college.degreeLevel} institution located in {formatLocation(college.city, college.state)}.
                      {college.acceptanceRate && ` With an acceptance rate of ${formatPercentage(college.acceptanceRate)}, `}
                      {college.name} offers a comprehensive range of academic programs.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Student Body</h2>
                    <p className="text-gray-600 text-sm">
                      Demographic information is not currently available in our database. Please visit the college website for detailed student body statistics.
                    </p>
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
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Academic Information</h2>
                    <p className="text-gray-600 text-sm">
                      Detailed graduation rates and academic statistics are not currently available. Please visit the college website for comprehensive academic data.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="admissions" className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Admissions Statistics</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      {college.acceptanceRate && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Acceptance Rate</p>
                          <p className="text-lg font-bold text-gray-900">{formatPercentage(college.acceptanceRate)}</p>
                        </div>
                      )}
                      {college.satAvg && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">SAT Average</p>
                          <p className="text-lg font-bold text-gray-900">{formatTestScore(college.satAvg)}</p>
                        </div>
                      )}
                      {college.actAvg && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">ACT Average</p>
                          <p className="text-lg font-bold text-gray-900">{formatTestScore(college.actAvg)}</p>
                        </div>
                      )}
                    </div>
                    {!college.acceptanceRate && !college.satAvg && !college.actAvg && (
                      <p className="text-gray-600 text-sm">
                        Detailed admissions statistics are not currently available. Please visit the college website for admission requirements and deadlines.
                      </p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="cost" className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Cost of Attendance</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-[#1a5d3a]/5 rounded-xl p-4">
                        <p className="text-sm text-gray-500 mb-1">In-State Tuition</p>
                        <p className="text-2xl font-bold text-[#1a5d3a]">{formatCurrency(college.inStateTuition)}</p>
                        <p className="text-xs text-gray-500 mt-1">per year</p>
                      </div>
                      <div className="bg-[#f5a623]/10 rounded-xl p-4">
                        <p className="text-sm text-gray-500 mb-1">Out-of-State Tuition</p>
                        <p className="text-2xl font-bold text-[#f5a623]">{formatCurrency(college.outStateTuition)}</p>
                        <p className="text-xs text-gray-500 mt-1">per year</p>
                      </div>
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

              {/* Location Info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Location</h3>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin size={18} className="text-[#1a5d3a]" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{formatLocation(college.city, college.state)}</p>
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
