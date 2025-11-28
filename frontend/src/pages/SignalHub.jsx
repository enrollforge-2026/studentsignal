import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collegesAPI, scholarshipsAPI } from '../services/api';
import Header from '../components/top/TopExperienceLayer';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  GraduationCap, DollarSign, Calendar, CheckCircle, Clock, 
  TrendingUp, Award, BookOpen, FileText, User, Target,
  Bell, Settings, Plus, Filter, Download, Share2,
  MapPin, Bookmark, AlertCircle, Star, Activity
} from 'lucide-react';

const SignalHub = () => {
  const { user } = useAuth();
  const [savedColleges, setSavedColleges] = useState([]);
  const [savedScholarships, setSavedScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for dashboard
  const [applications, setApplications] = useState([
    { id: 1, college: 'Stanford University', status: 'In Progress', deadline: '2025-01-15', progress: 75 },
    { id: 2, college: 'MIT', status: 'Not Started', deadline: '2025-01-15', progress: 0 },
    { id: 3, college: 'UC Berkeley', status: 'Submitted', deadline: '2024-11-30', progress: 100 },
    { id: 4, college: 'Harvard University', status: 'In Progress', deadline: '2025-01-01', progress: 60 }
  ]);

  const [testScores, setTestScores] = useState({
    sat: { current: 1450, goal: 1550, attempts: [1350, 1420, 1450] },
    act: { current: 32, goal: 35, attempts: [30, 31, 32] }
  });

  const [essays, setEssays] = useState([
    { id: 1, title: 'Common App Essay', progress: 80, wordCount: 600, maxWords: 650, status: 'Draft' },
    { id: 2, title: 'Why Stanford', progress: 100, wordCount: 250, maxWords: 250, status: 'Complete' },
    { id: 3, title: 'UC Personal Insight', progress: 40, wordCount: 150, maxWords: 350, status: 'In Progress' }
  ]);

  const [recommendations, setRecommendations] = useState([
    { id: 1, recommender: 'Ms. Johnson (English)', status: 'Completed', date: '2024-11-15' },
    { id: 2, recommender: 'Mr. Smith (Math)', status: 'Requested', date: '2024-11-20' },
    { id: 3, recommender: 'Dr. Williams (Counselor)', status: 'In Progress', date: null }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [colleges, scholarships] = await Promise.all([
          collegesAPI.getSavedColleges(),
          scholarshipsAPI.getSavedScholarships()
        ]);
        setSavedColleges(colleges);
        setSavedScholarships(scholarships);
      } catch (error) {
        console.error('Error fetching saved items:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  // Stats calculations
  const stats = {
    savedColleges: savedColleges.length,
    savedScholarships: savedScholarships.length,
    applicationsInProgress: applications.filter(a => a.status === 'In Progress').length,
    upcomingDeadlines: applications.filter(a => new Date(a.deadline) > new Date()).length,
    totalScholarshipValue: savedScholarships.reduce((sum, s) => {
      const amount = parseInt(s.amount.replace(/[^0-9]/g, '')) || 0;
      return sum + amount;
    }, 0)
  };

  const applicationStatusData = [
    { name: 'Submitted', value: applications.filter(a => a.status === 'Submitted').length, color: '#1a5d3a' },
    { name: 'In Progress', value: applications.filter(a => a.status === 'In Progress').length, color: '#f5a623' },
    { name: 'Not Started', value: applications.filter(a => a.status === 'Not Started').length, color: '#dc2626' }
  ];

  const testScoreProgressData = [
    { test: 'SAT', score: testScores.sat.current, goal: testScores.sat.goal },
    { test: 'ACT', score: testScores.act.current * 47, goal: testScores.act.goal * 47 } // Scale ACT for visualization
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopExperienceLayer />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <GraduationCap className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Signal Hub</h2>
            <p className="text-gray-600 mb-6">Please log in to access your personalized dashboard</p>
            <Link to="/login">
              <Button className="bg-[#1a5d3a] hover:bg-[#155d35] text-white">
                Log In
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopExperienceLayer />

      <main className="flex-1">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#1a5d3a] to-[#2d8659] text-white py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user.first_name}! 👋</h1>
                <p className="text-white/90">Your college journey command center</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <Bell size={18} className="mr-2" />
                  Notifications
                </Button>
                <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <Settings size={18} className="mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="max-w-7xl mx-auto px-4 -mt-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#1a5d3a]">
              <div className="flex items-center justify-between mb-2">
                <Bookmark className="text-[#1a5d3a]" size={24} />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.savedColleges}</div>
              <div className="text-sm text-gray-600">Saved Colleges</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#f5a623]">
              <div className="flex items-center justify-between mb-2">
                <Award className="text-[#f5a623]" size={24} />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.savedScholarships}</div>
              <div className="text-sm text-gray-600">Scholarships</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <Activity className="text-blue-500" size={24} />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.applicationsInProgress}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="text-purple-500" size={24} />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.upcomingDeadlines}</div>
              <div className="text-sm text-gray-600">Deadlines</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="text-green-500" size={24} />
              </div>
              <div className="text-2xl font-bold text-gray-900">${(stats.totalScholarshipValue / 1000).toFixed(0)}K</div>
              <div className="text-sm text-gray-600">Total Aid Value</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Application Tracker */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FileText size={24} className="text-[#1a5d3a]" />
                    Application Tracker
                  </h2>
                  <Button size="sm" className="bg-[#1a5d3a] hover:bg-[#155d35] text-white">
                    <Plus size={16} className="mr-1" />
                    Add Application
                  </Button>
                </div>

                <div className="space-y-3">
                  {applications.map((app) => (
                    <div key={app.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{app.college}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          app.status === 'Submitted' ? 'bg-green-100 text-green-800' :
                          app.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          Deadline: {new Date(app.deadline).toLocaleDateString()}
                        </span>
                        <span>{app.progress}% Complete</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#1a5d3a] h-2 rounded-full transition-all"
                          style={{ width: `${app.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application Status Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Application Status Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={applicationStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {applicationStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={testScoreProgressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="test" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="score" fill="#1a5d3a" name="Current Score" />
                        <Bar dataKey="goal" fill="#f5a623" name="Goal" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Essay Progress */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen size={24} className="text-[#f5a623]" />
                    Essay Progress
                  </h2>
                  <Button size="sm" variant="outline">
                    <Plus size={16} className="mr-1" />
                    New Essay
                  </Button>
                </div>

                <div className="space-y-4">
                  {essays.map((essay) => (
                    <div key={essay.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{essay.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          essay.status === 'Complete' ? 'bg-green-100 text-green-800' :
                          essay.status === 'Draft' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {essay.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>{essay.wordCount} / {essay.maxWords} words</span>
                        <span>{essay.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#f5a623] h-2 rounded-full"
                          style={{ width: `${essay.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              
              {/* Upcoming Deadlines */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-red-500" />
                  Upcoming Deadlines
                </h2>
                <div className="space-y-3">
                  {applications
                    .filter(a => new Date(a.deadline) > new Date())
                    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                    .slice(0, 5)
                    .map((app) => (
                      <div key={app.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <AlertCircle className="text-red-500" size={20} />
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-gray-900">{app.college}</div>
                          <div className="text-xs text-gray-600">{new Date(app.deadline).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={20} className="text-blue-500" />
                  Recommendations
                </h2>
                <div className="space-y-3">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">{rec.recommender}</div>
                        <div className="text-xs text-gray-600">{rec.status}</div>
                      </div>
                      <CheckCircle 
                        className={rec.status === 'Completed' ? 'text-green-500' : 'text-gray-300'} 
                        size={20} 
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Test Scores */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Target size={20} className="text-purple-500" />
                  Test Scores
                </h2>
                <div className="space-y-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">SAT</span>
                      <span className="text-2xl font-bold text-purple-600">{testScores.sat.current}</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">Goal: {testScores.sat.goal}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${(testScores.sat.current / testScores.sat.goal) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">ACT</span>
                      <span className="text-2xl font-bold text-blue-600">{testScores.act.current}</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">Goal: {testScores.act.goal}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(testScores.act.current / testScores.act.goal) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <Link to="/colleges">
                    <button className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                      🔍 Search Colleges
                    </button>
                  </Link>
                  <Link to="/scholarships">
                    <button className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                      💰 Find Scholarships
                    </button>
                  </Link>
                  <button className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                    📊 Compare Colleges
                  </button>
                  <button className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                    📝 Essay Helper
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignalHub;
