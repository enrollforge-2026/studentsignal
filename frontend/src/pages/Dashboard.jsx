// Dashboard.jsx — Clean Enterprise Version (renders inside AuthenticatedLayout)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collegesAPI, scholarshipsAPI } from '../services/api';
import {
  Bookmark,
  Award,
  TrendingUp,
  Target,
  ExternalLink
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [savedColleges, setSavedColleges] = useState([]);
  const [savedScholarships, setSavedScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [colleges, scholarships] = await Promise.all([
          collegesAPI.getSavedColleges(),
          scholarshipsAPI.getSavedScholarships()
        ]);
        setSavedColleges(colleges);
        setSavedScholarships(scholarships);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004C3F]"></div>
      </div>
    );
  }

  const stats = [
    {
      icon: Bookmark,
      label: 'Saved Colleges',
      value: savedColleges.length,
      color: '#004C3F'
    },
    {
      icon: Award,
      label: 'Saved Scholarships',
      value: savedScholarships.length,
      color: '#FF8A5B'
    },
    {
      icon: Target,
      label: 'Application Goal',
      value: '8-12',
      color: '#3B82F6'
    },
    {
      icon: TrendingUp,
      label: 'Profile Strength',
      value: '78%',
      color: '#10B981'
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#2A2F35' }}>
          Welcome back, {user?.first_name || 'Student'}!
        </h1>
        <p className="text-base" style={{ color: '#6B7280' }}>
          Here's your college journey overview
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4"
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${stat.color}15` }}
            >
              <stat.icon size={24} style={{ color: stat.color }} />
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: '#2A2F35' }}>
                {stat.value}
              </div>
              <div className="text-sm" style={{ color: '#6B7280' }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recently Saved Colleges */}
      <div className="bg-white p-8 rounded-xl border shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: '#2A2F35' }}>
            Saved Colleges
          </h2>
          <Link
            to="/explore/colleges"
            className="text-sm font-medium flex items-center gap-1"
            style={{ color: '#004C3F' }}
          >
            View All
            <ExternalLink size={14} />
          </Link>
        </div>

        {savedColleges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedColleges.slice(0, 6).map((college) => (
              <div
                key={college.id}
                className="p-4 bg-gray-50 rounded-xl border hover:border-[#004C3F] transition-all cursor-pointer"
                style={{ borderColor: '#E1E4E8' }}
              >
                <h3 className="font-semibold text-sm mb-1" style={{ color: '#2A2F35' }}>
                  {college.name}
                </h3>
                <p className="text-xs" style={{ color: '#6B7280' }}>
                  {college.location || college.state}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Bookmark size={48} className="mx-auto mb-3" style={{ color: '#E1E4E8' }} />
            <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
              You haven't saved any colleges yet
            </p>
            <Link
              to="/explore/colleges"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#004C3F] text-white rounded-lg text-sm font-medium"
            >
              Explore Colleges
            </Link>
          </div>
        )}
      </div>

      {/* Recently Saved Scholarships */}
      <div className="bg-white p-8 rounded-xl border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: '#2A2F35' }}>
            Saved Scholarships
          </h2>
          <Link
            to="/explore/scholarships"
            className="text-sm font-medium flex items-center gap-1"
            style={{ color: '#004C3F' }}
          >
            View All
            <ExternalLink size={14} />
          </Link>
        </div>

        {savedScholarships.length > 0 ? (
          <div className="space-y-3">
            {savedScholarships.slice(0, 5).map((scholarship) => (
              <div
                key={scholarship.id}
                className="p-4 bg-gray-50 rounded-xl border hover:border-[#004C3F] transition-all cursor-pointer flex items-center justify-between"
                style={{ borderColor: '#E1E4E8' }}
              >
                <div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: '#2A2F35' }}>
                    {scholarship.name}
                  </h3>
                  <p className="text-xs" style={{ color: '#6B7280' }}>
                    {scholarship.type}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm" style={{ color: '#004C3F' }}>
                    {scholarship.amount}
                  </div>
                  {scholarship.deadline && (
                    <div className="text-xs" style={{ color: '#6B7280' }}>
                      Due: {new Date(scholarship.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Award size={48} className="mx-auto mb-3" style={{ color: '#E1E4E8' }} />
            <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
              You haven't saved any scholarships yet
            </p>
            <Link
              to="/explore/scholarships"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#004C3F] text-white rounded-lg text-sm font-medium"
            >
              Explore Scholarships
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
