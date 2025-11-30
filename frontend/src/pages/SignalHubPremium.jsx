import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collegesAPI, scholarshipsAPI } from '../services/api';
import { motion } from 'framer-motion';
import {
  RadialBarChart, RadialBar, ResponsiveContainer
} from 'recharts';
import {
  Calendar, Clock, FileText, Award, Bookmark, Activity,
  AlertCircle, ArrowRight, Plus
} from 'lucide-react';

const SignalHubPremium = () => {
  const { user } = useAuth();
  const [savedColleges, setSavedColleges] = useState([]);
  const [savedScholarships, setSavedScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  const applications = [
    { id: 1, college: 'Stanford University', status: 'In Progress', deadline: '2025-01-15', progress: 75, color: '#FF8A5B' },
    { id: 2, college: 'MIT', status: 'Not Started', deadline: '2025-01-15', progress: 0, color: '#dc2626' },
    { id: 3, college: 'UC Berkeley', status: 'Submitted', deadline: '2024-11-30', progress: 100, color: '#004C3F' },
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
    { name: 'SAT', value: (testScores.sat.current / testScores.sat.goal) * 100, fill: '#004C3F' },
    { name: 'ACT', value: (testScores.act.current / testScores.act.goal) * 100, fill: '#FF8A5B' }
  ];

  if (loading) {
    return (
      <div className="min-h-full bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004C3F]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Section */}
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#2A2F35' }}>
            Welcome back, <span style={{ color: '#004C3F' }}>{user?.first_name || 'Student'}</span>
          </h1>
          <p className="text-base" style={{ color: '#6B7280' }}>
            Your personalized college journey dashboard
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Bookmark, label: 'Saved Colleges', value: stats.savedColleges, color: '#004C3F' },
            { icon: Award, label: 'Scholarships', value: stats.savedScholarships, color: '#FF8A5B' },
            { icon: Activity, label: 'In Progress', value: stats.applicationsInProgress, color: '#3B82F6' },
            { icon: Calendar, label: 'Deadlines', value: stats.upcomingDeadlines, color: '#8B5CF6' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border"
              style={{ borderColor: '#E1E4E8' }}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon size={24} style={{ color: stat.color }} />
              </div>
              <div className="text-3xl font-bold mb-1" style={{ color: '#2A2F35' }}>
                {stat.value}
              </div>
              <div className="text-sm font-medium" style={{ color: '#6B7280' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Application Tracker */}
            <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: '#E1E4E8' }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: '#004C3F' }}
                  >
                    <FileText className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: '#2A2F35' }}>
                      Application Tracker
                    </h2>
                    <p className="text-sm" style={{ color: '#6B7280' }}>
                      Monitor your application progress
                    </p>
                  </div>
                </div>
                <button 
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2"
                  style={{ backgroundColor: '#004C3F' }}
                >
                  <Plus size={16} />
                  Add Application
                </button>
              </div>

              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-gray-50 rounded-xl p-4 border"
                    style={{ borderColor: '#E1E4E8' }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-base" style={{ color: '#2A2F35' }}>
                        {app.college}
                      </h3>
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: app.status === 'Submitted' ? '#D1FAE5' : 
                                         app.status === 'In Progress' ? '#FEF3C7' : '#FEE2E2',
                          color: app.status === 'Submitted' ? '#065F46' :
                                 app.status === 'In Progress' ? '#92400E' : '#991B1B'
                        }}
                      >
                        {app.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm mb-3" style={{ color: '#6B7280' }}>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(app.deadline).toLocaleDateString()}
                      </span>
                      <span className="font-semibold">{app.progress}% Complete</span>
                    </div>
                    <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full rounded-full"
                        style={{ 
                          width: `${app.progress}%`,
                          backgroundColor: app.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Score Progress */}
            <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: '#E1E4E8' }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: '#2A2F35' }}>
                Test Score Progress
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <ResponsiveContainer width="100%" height={180}>
                    <RadialBarChart innerRadius="60%" outerRadius="100%" data={[radialData[0]]} startAngle={180} endAngle={0}>
                      <RadialBar dataKey="value" cornerRadius={10} fill="#004C3F" />
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold" fill="#004C3F">
                        {testScores.sat.current}
                      </text>
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="mt-4">
                    <div className="text-sm font-semibold" style={{ color: '#6B7280' }}>SAT Score</div>
                    <div className="text-xs" style={{ color: '#9CA3AF' }}>Goal: {testScores.sat.goal}</div>
                  </div>
                </div>
                <div className="text-center">
                  <ResponsiveContainer width="100%" height={180}>
                    <RadialBarChart innerRadius="60%" outerRadius="100%" data={[radialData[1]]} startAngle={180} endAngle={0}>
                      <RadialBar dataKey="value" cornerRadius={10} fill="#FF8A5B" />
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold" fill="#FF8A5B">
                        {testScores.act.current}
                      </text>
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="mt-4">
                    <div className="text-sm font-semibold" style={{ color: '#6B7280' }}>ACT Score</div>
                    <div className="text-xs" style={{ color: '#9CA3AF' }}>Goal: {testScores.act.goal}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            
            {/* Urgent Deadlines */}
            <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: '#E1E4E8' }}>
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#FEE2E2' }}
                >
                  <Clock size={16} style={{ color: '#DC2626' }} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: '#2A2F35' }}>
                  Urgent Deadlines
                </h2>
              </div>
              <div className="space-y-3">
                {applications
                  .filter(a => new Date(a.deadline) > new Date())
                  .slice(0, 3)
                  .map((app) => (
                    <div
                      key={app.id}
                      className="bg-red-50 rounded-lg p-3 border"
                      style={{ borderColor: '#FECACA' }}
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle className="flex-shrink-0" size={16} style={{ color: '#DC2626' }} />
                        <div className="flex-1">
                          <div className="font-semibold text-sm" style={{ color: '#2A2F35' }}>
                            {app.college}
                          </div>
                          <div className="text-xs mt-1" style={{ color: '#6B7280' }}>
                            {new Date(app.deadline).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: '#E1E4E8' }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: '#2A2F35' }}>
                Quick Actions
              </h2>
              <div className="space-y-2">
                {[
                  { icon: '🔍', label: 'Search Colleges', link: '/colleges' },
                  { icon: '💰', label: 'Find Scholarships', link: '/scholarships' },
                  { icon: '📊', label: 'Compare Colleges', link: '/tools/compare' },
                  { icon: '📝', label: 'Essay Helper', link: '/tools/coach' }
                ].map((action, index) => (
                  <Link key={index} to={action.link}>
                    <button
                      className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all border flex items-center justify-between"
                      style={{ borderColor: '#E1E4E8', color: '#2A2F35' }}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-xl">{action.icon}</span>
                        {action.label}
                      </span>
                      <ArrowRight size={16} style={{ color: '#6B7280' }} />
                    </button>
                  </Link>
                ))}
              </div>
            </div>

            {/* Achievement Badge */}
            <div 
              className="rounded-xl p-6 shadow-sm text-white"
              style={{ backgroundColor: '#004C3F' }}
            >
              <h3 className="text-lg font-bold mb-2">You're doing great! 🎓</h3>
              <p className="text-white/90 text-sm mb-4">
                {stats.applicationsInProgress} applications in progress. Keep up the excellent work!
              </p>
              <button className="bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/30 transition-all">
                View Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalHubPremium;
