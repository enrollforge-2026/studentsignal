// Legacy SignalHubPremium implementation (pre-NORAD cleanup).
// Archived for reference. Do not import into production.

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collegesAPI, scholarshipsAPI } from '../services/api';
import TopExperienceLayer from '../components/top/TopExperienceLayer';
import Footer from '../components/layout/Footer';
import ElonChat from '../components/ElonChat';
import Sidebar from '../components/signalhub/Sidebar';
import ProfileView from '../components/signalhub/ProfileView';
import SchoolsView from '../components/signalhub/SchoolsView';
import ToDoView from '../components/signalhub/ToDoView';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  GraduationCap, DollarSign, Calendar, CheckCircle, Clock, 
  TrendingUp, Award, BookOpen, FileText, User, Target,
  Bell, Settings, Plus, Filter, Download, Share2,
  MapPin, Bookmark, AlertCircle, Star, Activity,
  ArrowRight, Sparkles, Trophy, Heart, Zap
} from 'lucide-react';

const SignalHubPremium = () => {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const [savedColleges, setSavedColleges] = useState([]);
  const [savedScholarships, setSavedScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');

  const applications = [
    { id: 1, college: 'Stanford University', status: 'In Progress', deadline: '2025-01-15', progress: 75, color: '#FF8A5B' },
    { id: 2, college: 'MIT', status: 'Not Started', deadline: '2025-01-15', progress: 0, color: '#dc2626' },
    { id: 3, college: 'UC Berkeley', status: 'Submitted', deadline: '2024-11-30', progress: 100, color: '#1A535C' },
    { id: 4, college: 'Harvard University', status: 'In Progress', deadline: '2025-01-01', progress: 60, color: '#FF8A5B' }
  ];

  const testScores = {
    sat: { current: 1450, goal: 1550 },
    act: { current: 32, goal: 35 }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const [colleges, scholarships] = await Promise.all([
            collegesAPI.getSavedColleges(),
            scholarshipsAPI.getSavedScholarships()
          ]);
          setSavedColleges(colleges);
          setSavedScholarships(scholarships);
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [user]);

  const stats = {
    savedColleges: savedColleges.length,
    savedScholarships: savedScholarships.length,
    applicationsInProgress: applications.filter(a => a.status === 'In Progress').length,
    upcomingDeadlines: applications.filter(a => new Date(a.deadline) > new Date()).length
  };

  const radialData = [
    { name: 'SAT', value: (testScores.sat.current / testScores.sat.goal) * 100, fill: '#1A535C' },
    { name: 'ACT', value: (testScores.act.current / testScores.act.goal) * 100, fill: '#FF8A5B' }
  ];

  // Show loading spinner while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-teal-50">
        <TopExperienceLayer />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1A535C]"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-teal-50">
        <TopExperienceLayer />
        <main className="flex-1 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto px-4"
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-12 border border-white">
              <div className="w-20 h-20 bg-gradient-to-br from-[#1A535C] to-[#2d8659] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="text-white" size={40} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Signal Hub</h2>
              <p className="text-gray-600 mb-8">Your personalized college journey command center awaits</p>
              <Link to="/login">
                <button className="w-full bg-gradient-to-r from-[#1A535C] to-[#2d8659] text-white py-4 px-8 rounded-xl font-semibold hover:shadow-xl transition-all transform hover:scale-105">
                  Get Started →
                </button>
              </Link>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  // Render the dashboard content as a component
  const DashboardView = () => (
    <div className="flex-1 bg-gradient-to-br from-gray-50 via-white to-teal-50 overflow-y-auto">
      {/* Decorative Wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden" style={{ height: '400px', zIndex: 0 }}>
        <svg viewBox="0 0 1440 320" className="absolute bottom-0" style={{ width: '100%', height: '100%' }}>
          <path fill="url(#gradient1)" fillOpacity="0.3" d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,133.3C672,117,768,107,864,122.7C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#1A535C', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#2d8659', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <main className="relative z-10">
        {/* Hero Section */}
        <div className="relative pt-8 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-12"
            >
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  Welcome back, <span className="text-[#1A535C]">{user.first_name}</span> 🎓
                </h1>
                <p className="text-lg text-gray-600">Your personalized college journey dashboard</p>
              </div>
              <div className="flex gap-3">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <Bell size={20} className="text-gray-700" />
                  <span className="hidden md:inline text-sm font-medium">Notifications</span>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <Settings size={20} className="text-gray-700" />
                </motion.button>
              </div>
            </motion.div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { icon: Bookmark, label: 'Saved Colleges', value: stats.savedColleges, color: 'from-[#1A535C] to-[#2d8659]', bgColor: 'bg-teal-50' },
                { icon: Award, label: 'Scholarships', value: stats.savedScholarships, color: 'from-[#FF8A5B] to-[#ff6b3d]', bgColor: 'bg-orange-50' },
                { icon: Activity, label: 'In Progress', value: stats.applicationsInProgress, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
                { icon: Calendar, label: 'Deadlines', value: stats.upcomingDeadlines, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white hover:shadow-2xl transition-all cursor-pointer"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                    <stat.icon className="text-white" size={28} />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Application Tracker */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1A535C] to-[#2d8659] rounded-xl flex items-center justify-center">
                      <FileText className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Application Tracker</h2>
                      <p className="text-sm text-gray-600">Monitor your application progress</p>
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-[#FF8A5B] to-[#ff6b3d] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all">
                    <Plus size={18} />
                    Add Application
                  </button>
                </div>

                <div className="space-y-4">
                  {applications.map((app, index) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-lg text-gray-900">{app.college}</h3>
                        <span className={`px-4 py-2 rounded-full text-xs font-bold ${
                          app.status === 'Submitted' ? 'bg-green-100 text-green-700' :
                          app.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar size={16} />
                          {new Date(app.deadline).toLocaleDateString()}
                        </span>
                        <span className="font-semibold">{app.progress}% Complete</span>
                      </div>
                      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${app.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                          className="absolute top-0 left-0 h-full rounded-full"
                          style={{ background: `linear-gradient(to right, ${app.color}, ${app.color}dd)` }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Test Scores Visualization */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Test Score Progress</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <ResponsiveContainer width="100%" height={200}>
                      <RadialBarChart innerRadius="60%" outerRadius="100%" data={[radialData[0]]} startAngle={180} endAngle={0}>
                        <RadialBar dataKey="value" cornerRadius={10} fill="#1A535C" />
                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold" fill="#1A535C">
                          {testScores.sat.current}
                        </text>
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="mt-4">
                      <div className="text-sm font-semibold text-gray-600">SAT Score</div>
                      <div className="text-xs text-gray-500">Goal: {testScores.sat.goal}</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <ResponsiveContainer width="100%" height={200}>
                      <RadialBarChart innerRadius="60%" outerRadius="100%" data={[radialData[1]]} startAngle={180} endAngle={0}>
                        <RadialBar dataKey="value" cornerRadius={10} fill="#FF8A5B" />
                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold" fill="#FF8A5B">
                          {testScores.act.current}
                        </text>
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="mt-4">
                      <div className="text-sm font-semibold text-gray-600">ACT Score</div>
                      <div className="text-xs text-gray-500">Goal: {testScores.act.goal}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-8">
              
              {/* Upcoming Deadlines */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <Clock className="text-white" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Urgent Deadlines</h2>
                </div>
                <div className="space-y-3">
                  {applications
                    .filter(a => new Date(a.deadline) > new Date())
                    .slice(0, 3)
                    .map((app, index) => (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-100"
                      >
                        <div className="flex items-start gap-3">
                          <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                          <div className="flex-1">
                            <div className="font-semibold text-sm text-gray-900">{app.college}</div>
                            <div className="text-xs text-gray-600 mt-1">{new Date(app.deadline).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                <div className="space-y-3">
                  {[
                    { icon: '🔍', label: 'Search Colleges', link: '/colleges' },
                    { icon: '💰', label: 'Find Scholarships', link: '/scholarships' },
                    { icon: '📊', label: 'Compare Colleges', link: '#' },
                    { icon: '📝', label: 'Essay Helper', link: '#' }
                  ].map((action, index) => (
                    <Link key={index} to={action.link}>
                      <motion.button
                        whileHover={{ scale: 1.05, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full text-left px-5 py-4 bg-gradient-to-r from-gray-50 to-white rounded-xl text-sm font-semibold text-gray-700 hover:shadow-lg transition-all border border-gray-100 flex items-center justify-between"
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-2xl">{action.icon}</span>
                          {action.label}
                        </span>
                        <ArrowRight size={18} className="text-gray-400" />
                      </motion.button>
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Achievement Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-[#FF8A5B] to-[#ff6b3d] rounded-3xl p-6 shadow-xl text-white relative overflow-hidden"
              >
                <Sparkles className="absolute top-4 right-4 opacity-20" size={60} />
                <Trophy className="text-white/90 mb-4" size={40} />
                <h3 className="text-xl font-bold mb-2">You're on fire! 🔥</h3>
                <p className="text-white/90 text-sm mb-4">{stats.applicationsInProgress} applications in progress. Keep up the great work!</p>
                <button className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/30 transition-all">
                  View Progress
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  // Main return with sidebar
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopExperienceLayer />
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar activeView={activeView} setActiveView={setActiveView} user={user} />
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'profile' && <ProfileView user={user} refreshUser={refreshUser} />}
          {activeView === 'schools' && <SchoolsView />}
          {activeView === 'scholarships' && (
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Scholarships</h1>
              <p className="text-gray-600">View coming soon. For now, visit the <Link to="/scholarships" className="text-[#1A535C] font-semibold hover:underline">Scholarships page</Link>.</p>
            </div>
          )}
          {activeView === 'todo' && <ToDoView />}
          {activeView === 'bookmarks' && (
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Bookmarks</h1>
              <p className="text-gray-600">Bookmarks feature coming soon.</p>
            </div>
          )}
          {activeView === 'offers' && (
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Offers</h1>
              <p className="text-gray-600">Offers feature coming soon.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Elon AI Chatbot */}
      <ElonChat />
    </div>
  );
};

export default SignalHubPremium;