import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { colleges } from '../data/mockData';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  MapPin, DollarSign, Users, GraduationCap, Building2, 
  TrendingUp, Award, BookOpen, Home, Shield, ChevronDown, ChevronUp
} from 'lucide-react';

const CollegeDetailPageNew = () => {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    const foundCollege = colleges.find(c => c.id === parseInt(id));
    setCollege(foundCollege);
  }, [id]);

  if (!college) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Mock data for charts
  const genderData = [
    { name: 'Male', value: 49, color: '#1a5d3a' },
    { name: 'Female', value: 51, color: '#f5a623' }
  ];

  const ethnicityData = [
    { name: 'White', value: 35, fill: '#1a5d3a' },
    { name: 'Asian', value: 25, fill: '#2d8659' },
    { name: 'Hispanic', value: 18, fill: '#4a9d6f' },
    { name: 'Black', value: 12, fill: '#f5a623' },
    { name: 'Other', value: 10, fill: '#e09000' }
  ];

  const admissionsData = [
    { year: '2020', rate: college.acceptanceRate + 1 },
    { year: '2021', rate: college.acceptanceRate + 0.5 },
    { year: '2022', rate: college.acceptanceRate },
    { year: '2023', rate: college.acceptanceRate - 0.3 },
    { year: '2024', rate: college.acceptanceRate - 0.5 }
  ];

  const graduationData = [
    { year: '4 Years', rate: 85 },
    { year: '5 Years', rate: 93 },
    { year: '6 Years', rate: college.graduationRate }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'cost', label: 'Cost & Aid', icon: DollarSign },
    { id: 'admissions', label: 'Admissions', icon: GraduationCap },
    { id: 'academics', label: 'Academics', icon: Award },
    { id: 'campus', label: 'Campus Life', icon: Home }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="relative h-96">
        <img 
          src={college.image} 
          alt={college.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2">{college.name}</h1>
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-1">
                <MapPin size={18} />
                <span>{college.location}</span>
              </div>
              <span>•</span>
              <span>{college.type}</span>
              <span>•</span>
              <span className="font-semibold">{college.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-[#1a5d3a] border-b-2 border-[#1a5d3a]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#1a5d3a]">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="text-[#1a5d3a]" size={24} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">${college.tuitionInState.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Avg Net Price</div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#f5a623]">
                  <div className="flex items-center justify-between mb-2">
                    <GraduationCap className="text-[#f5a623]" size={24} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{college.acceptanceRate}%</div>
                  <div className="text-sm text-gray-600">Acceptance Rate</div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="text-blue-500" size={24} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{college.enrollment.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="text-purple-500" size={24} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{college.graduationRate}%</div>
                  <div className="text-sm text-gray-600">Graduation Rate</div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About {college.shortName}</h2>
                <p className="text-gray-700 leading-relaxed">{college.description}</p>
                {college.features && college.features.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Key Features:</h3>
                    <div className="flex flex-wrap gap-2">
                      {college.features.map((feature, index) => (
                        <span key={index} className="px-3 py-1 bg-[#1a5d3a]/10 text-[#1a5d3a] rounded-full text-sm font-medium">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Student Demographics */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Demographics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={genderData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {genderData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Ethnic Diversity</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={ethnicityData}>
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
            </div>
          )}

          {/* Cost & Aid Tab */}
          {activeTab === 'cost' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('tuition')}>
                  <h2 className="text-2xl font-bold text-gray-900">Tuition & Costs</h2>
                  {expandedSections['tuition'] ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
                
                {expandedSections['tuition'] && (
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">In-State Tuition</div>
                        <div className="text-2xl font-bold text-[#1a5d3a]">${college.tuitionInState.toLocaleString()}</div>
                        <div className="text-xs text-gray-500 mt-1">per year</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Out-of-State Tuition</div>
                        <div className="text-2xl font-bold text-[#f5a623]">${college.tuitionOutState.toLocaleString()}</div>
                        <div className="text-xs text-gray-500 mt-1">per year</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                      <p className="text-sm text-gray-700">
                        <strong>Note:</strong> These figures represent the sticker price. Most students pay significantly less after financial aid.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('aid')}>
                  <h2 className="text-2xl font-bold text-gray-900">Financial Aid</h2>
                  {expandedSections['aid'] ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
                
                {expandedSections['aid'] && (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                        <div className="text-sm font-medium text-green-800 mb-2">Average Grant Aid</div>
                        <div className="text-3xl font-bold text-green-900">$45,000</div>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                        <div className="text-sm font-medium text-blue-800 mb-2">Students with Aid</div>
                        <div className="text-3xl font-bold text-blue-900">78%</div>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                        <div className="text-sm font-medium text-purple-800 mb-2">Avg Loan Debt</div>
                        <div className="text-3xl font-bold text-purple-900">$15,000</div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button className="bg-[#1a5d3a] hover:bg-[#155d35] text-white">
                        Calculate Your Net Cost
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Admissions Tab */}
          {activeTab === 'admissions' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('admissionStats')}>
                  <h2 className="text-2xl font-bold text-gray-900">Admission Statistics</h2>
                  {expandedSections['admissionStats'] ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
                
                {expandedSections['admissionStats'] && (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl font-bold text-[#1a5d3a]">{college.acceptanceRate}%</div>
                        <div className="text-sm text-gray-600 mt-1">Acceptance Rate</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl font-bold text-[#f5a623]">{college.actRange}</div>
                        <div className="text-sm text-gray-600 mt-1">ACT Range</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600">{college.satRange}</div>
                        <div className="text-sm text-gray-600 mt-1">SAT Range</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Acceptance Rate Trend</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={admissionsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="rate" stroke="#1a5d3a" strokeWidth={3} name="Acceptance Rate %" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('requirements')}>
                  <h2 className="text-2xl font-bold text-gray-900">Application Requirements</h2>
                  {expandedSections['requirements'] ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
                
                {expandedSections['requirements'] && (
                  <div className="mt-4 space-y-3">
                    {[
                      { label: 'Common Application', required: true },
                      { label: 'High School Transcript', required: true },
                      { label: 'SAT/ACT Scores', required: false, note: 'Test Optional' },
                      { label: 'Letters of Recommendation', required: true },
                      { label: 'Personal Essay', required: true },
                      { label: 'Application Fee: $75', required: true }
                    ].map((req, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">{req.label}</span>
                        <div className="flex items-center gap-2">
                          {req.note && <span className="text-sm text-blue-600">{req.note}</span>}
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            req.required ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {req.required ? 'Required' : 'Optional'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Academics Tab */}
          {activeTab === 'academics' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('majors')}>
                  <h2 className="text-2xl font-bold text-gray-900">Programs & Majors</h2>
                  {expandedSections['majors'] ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
                
                {expandedSections['majors'] && (
                  <div className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {college.majors && college.majors.map((major, index) => (
                        <div key={index} className="p-3 bg-[#1a5d3a]/5 rounded-lg border border-[#1a5d3a]/20 hover:bg-[#1a5d3a]/10 transition-colors">
                          <div className="font-medium text-gray-900 text-sm">{major}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('graduation')}>
                  <h2 className="text-2xl font-bold text-gray-900">Graduation Rates</h2>
                  {expandedSections['graduation'] ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
                
                {expandedSections['graduation'] && (
                  <div className="mt-4">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={graduationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="rate" fill="#1a5d3a" name="Graduation Rate %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Student-Faculty Ratio</h2>
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-[#1a5d3a]">12:1</div>
                    <div className="text-gray-600 mt-2">Students per Faculty Member</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Campus Life Tab */}
          {activeTab === 'campus' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('housing')}>
                  <h2 className="text-2xl font-bold text-gray-900">Housing & Facilities</h2>
                  {expandedSections['housing'] ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
                
                {expandedSections['housing'] && (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                        <Home className="text-blue-600 mb-2" size={32} />
                        <div className="text-2xl font-bold text-blue-900">96%</div>
                        <div className="text-sm text-blue-800">Students Living on Campus</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                        <Building2 className="text-green-600 mb-2" size={32} />
                        <div className="text-2xl font-bold text-green-900">45</div>
                        <div className="text-sm text-green-800">Residence Halls</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('activities')}>
                  <h2 className="text-2xl font-bold text-gray-900">Student Activities</h2>
                  {expandedSections['activities'] ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
                
                {expandedSections['activities'] && (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-6 bg-gray-50 rounded-lg">
                        <div className="text-4xl font-bold text-[#1a5d3a]">400+</div>
                        <div className="text-sm text-gray-600 mt-2">Student Organizations</div>
                      </div>
                      <div className="text-center p-6 bg-gray-50 rounded-lg">
                        <div className="text-4xl font-bold text-[#f5a623]">30+</div>
                        <div className="text-sm text-gray-600 mt-2">Varsity Sports</div>
                      </div>
                      <div className="text-center p-6 bg-gray-50 rounded-lg">
                        <div className="text-4xl font-bold text-blue-600">100+</div>
                        <div className="text-sm text-gray-600 mt-2">Campus Events/Year</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('safety')}>
                  <h2 className="text-2xl font-bold text-gray-900">Campus Safety</h2>
                  {expandedSections['safety'] ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
                
                {expandedSections['safety'] && (
                  <div className="mt-4 space-y-3">
                    {[
                      '24/7 Campus Security',
                      'Emergency Call Boxes',
                      'Well-lit Walkways',
                      'Safety Escort Service',
                      'Security Cameras'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Shield className="text-[#1a5d3a]" size={20} />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-8 bg-gradient-to-r from-[#1a5d3a] to-[#2d8659] rounded-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Apply?</h2>
            <p className="text-lg mb-6">Take the next step toward your future at {college.shortName}</p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-[#f5a623] hover:bg-[#e09000] text-white">
                Start Application
              </Button>
              <Button size="lg" variant="outline" className="bg-white text-[#1a5d3a] hover:bg-gray-100">
                Schedule a Visit
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CollegeDetailPageNew;
