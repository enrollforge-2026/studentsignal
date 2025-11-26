import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Award, Users, Mail, Plus, TrendingUp } from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    colleges: 0,
    scholarships: 0,
    users: 0,
    leads: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [collegesRes, scholarshipsRes, leadsRes] = await Promise.all([
        api.get('/colleges?limit=1'),
        api.get('/scholarships?limit=1'),
        api.get('/admin/leads'),
      ]);

      setStats({
        colleges: collegesRes.data.total || 0,
        scholarships: scholarshipsRes.data.total || 0,
        users: 0, // Not implemented yet
        leads: leadsRes.data.length || 0,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Colleges',
      value: stats.colleges,
      icon: GraduationCap,
      color: 'bg-blue-500',
      link: '/admin/colleges',
    },
    {
      title: 'Total Scholarships',
      value: stats.scholarships,
      icon: Award,
      color: 'bg-orange-500',
      link: '/admin/scholarships',
    },
    {
      title: 'Total Users',
      value: stats.users || 'N/A',
      icon: Users,
      color: 'bg-green-500',
      link: null,
    },
    {
      title: 'Total Leads',
      value: stats.leads,
      icon: Mail,
      color: 'bg-purple-500',
      link: null,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your Student Signal content and data</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const card = (
            <div
              key={stat.title}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="text-white" size={24} />
                </div>
                <TrendingUp className="text-green-500" size={20} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.title}</div>
            </div>
          );

          return stat.link ? (
            <Link to={stat.link} key={stat.title}>
              {card}
            </Link>
          ) : (
            <div key={stat.title}>{card}</div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/admin/colleges/new"
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <div className="bg-green-100 group-hover:bg-green-200 w-12 h-12 rounded-lg flex items-center justify-center transition-colors">
              <Plus className="text-green-700" size={24} />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Add New College</div>
              <div className="text-sm text-gray-600">Create a new college entry</div>
            </div>
          </Link>

          <Link
            to="/admin/scholarships/new"
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group"
          >
            <div className="bg-orange-100 group-hover:bg-orange-200 w-12 h-12 rounded-lg flex items-center justify-center transition-colors">
              <Plus className="text-orange-700" size={24} />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Add New Scholarship</div>
              <div className="text-sm text-gray-600">Create a new scholarship entry</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
