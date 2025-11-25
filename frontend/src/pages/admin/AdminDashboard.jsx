import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { colleges } from '../../data/mockData';
import {
  GraduationCap,
  Users,
  FileText,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Eye,
  Heart
} from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    {
      label: 'Total Colleges',
      value: colleges.length,
      change: '+12%',
      trend: 'up',
      icon: GraduationCap,
      color: 'bg-blue-500'
    },
    {
      label: 'Active Users',
      value: '2,847',
      change: '+18%',
      trend: 'up',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      label: 'Page Views',
      value: '45.2K',
      change: '+25%',
      trend: 'up',
      icon: Eye,
      color: 'bg-purple-500'
    },
    {
      label: 'Saved Schools',
      value: '8,392',
      change: '-3%',
      trend: 'down',
      icon: Heart,
      color: 'bg-red-500'
    }
  ];

  const recentActivity = [
    { action: 'New user registered', user: 'john@example.com', time: '2 min ago' },
    { action: 'College updated', user: 'admin@studentsignal.com', time: '15 min ago' },
    { action: 'Content edited', user: 'editor@studentsignal.com', time: '1 hour ago' },
    { action: 'New media uploaded', user: 'admin@studentsignal.com', time: '3 hours ago' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening with Student Signal.</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    {stat.change}
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.user}</p>
                  </div>
                  <span className="text-sm text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top colleges */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Top Viewed Colleges</h2>
            <div className="space-y-4">
              {colleges.slice(0, 4).map((college, index) => (
                <div key={college.id} className="flex items-center gap-4">
                  <span className="text-lg font-bold text-gray-400 w-6">#{index + 1}</span>
                  <img
                    src={college.image}
                    alt={college.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-grow">
                    <p className="font-medium text-gray-900">{college.shortName}</p>
                    <p className="text-sm text-gray-500">{college.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#1a5d3a]">{Math.floor(Math.random() * 5000 + 1000)} views</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:border-[#1a5d3a] hover:bg-[#1a5d3a]/5 transition-colors text-center">
              <GraduationCap className="mx-auto mb-2 text-[#1a5d3a]" size={24} />
              <span className="text-sm font-medium text-gray-700">Add College</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-[#1a5d3a] hover:bg-[#1a5d3a]/5 transition-colors text-center">
              <FileText className="mx-auto mb-2 text-[#1a5d3a]" size={24} />
              <span className="text-sm font-medium text-gray-700">Edit Content</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-[#1a5d3a] hover:bg-[#1a5d3a]/5 transition-colors text-center">
              <Users className="mx-auto mb-2 text-[#1a5d3a]" size={24} />
              <span className="text-sm font-medium text-gray-700">Manage Users</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-[#1a5d3a] hover:bg-[#1a5d3a]/5 transition-colors text-center">
              <TrendingUp className="mx-auto mb-2 text-[#1a5d3a]" size={24} />
              <span className="text-sm font-medium text-gray-700">View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
