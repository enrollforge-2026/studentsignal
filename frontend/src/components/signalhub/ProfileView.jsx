import React, { useState, useEffect } from 'react';
import { Edit2, Award, Upload, X } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'sonner';
import GPADropdown from '../forms/GPADropdown';
import HighSchoolSearch from '../forms/HighSchoolSearch';

const ProfileView = ({ user, refreshUser }) => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const response = await api.get('/api/user/badges');
      setBadges(response.data.badges);
    } catch (error) {
      console.error('Failed to load badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section) => {
    setEditMode(section);
    setFormData(user);
  };

  const handleSave = async (section) => {
    try {
      await api.put('/api/user/profile', formData);
      toast.success('Profile updated successfully!');
      setEditMode(null);
      if (refreshUser) refreshUser();
      fetchBadges(); // Refresh badges
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const getBadgeIcon = (badge) => {
    const icons = {
      'Profile Complete': '✓',
      'Photo Uploaded': '📷',
      'First Application': '🎓'
    };
    return icons[badge] || '⭐';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A535C]"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header with Badges */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Profile</h1>
        
        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-600">Badges:</span>
            {badges.map((badge, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-[#1A535C] to-[#2d8659] text-white rounded-full text-sm font-medium shadow-sm"
              >
                <span>{getBadgeIcon(badge)}</span>
                <span>{badge}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column */}
        <div className="space-y-6">
          
          {/* Account Details */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Account Details</h2>
              <button
                onClick={() => handleEdit('account')}
                className="text-[#1A535C] hover:text-[#2d8659] transition-colors"
              >
                <Edit2 size={18} />
              </button>
            </div>

            {editMode === 'account' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.first_name || ''}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A535C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.last_name || ''}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A535C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A535C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL</label>
                  <input
                    type="text"
                    value={formData.profile_picture_url || ''}
                    onChange={(e) => setFormData({ ...formData, profile_picture_url: e.target.value })}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A535C] focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave('account')}
                    className="flex-1 bg-gradient-to-r from-[#1A535C] to-[#2d8659] text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditMode(null)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium text-gray-900">{user.first_name} {user.last_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-900">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Grad Year:</span>
                  <span className="font-medium text-gray-900">{user.high_school_grad_year || 'Not set'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Academics */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Academics</h2>
              <button
                onClick={() => handleEdit('academics')}
                className="text-[#1A535C] hover:text-[#2d8659] transition-colors"
              >
                <Edit2 size={18} />
              </button>
            </div>

            {editMode === 'academics' ? (
              <div className="space-y-4">
                <HighSchoolSearch
                  value={formData.high_school_name || ''}
                  onChange={(value) => setFormData({ ...formData, high_school_name: value })}
                  label="High School"
                  placeholder="Search for your high school..."
                />
                <GPADropdown
                  value={formData.gpa || ''}
                  onChange={(value) => setFormData({ ...formData, gpa: value })}
                  label="GPA"
                  placeholder="Select GPA"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SAT Score</label>
                  <input
                    type="text"
                    value={formData.sat_score || ''}
                    onChange={(e) => setFormData({ ...formData, sat_score: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A535C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ACT Score</label>
                  <input
                    type="text"
                    value={formData.act_score || ''}
                    onChange={(e) => setFormData({ ...formData, act_score: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A535C] focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave('academics')}
                    className="flex-1 bg-gradient-to-r from-[#1A535C] to-[#2d8659] text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditMode(null)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">High School:</span>
                  <span className="font-medium text-gray-900">{user.high_school_name || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GPA:</span>
                  <span className="font-medium text-gray-900">{user.gpa || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SAT:</span>
                  <span className="font-medium text-gray-900">{user.sat_score || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ACT:</span>
                  <span className="font-medium text-gray-900">{user.act_score || 'Not set'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
              <button
                onClick={() => handleEdit('personal')}
                className="text-[#1A535C] hover:text-[#2d8659] transition-colors"
              >
                <Edit2 size={18} />
              </button>
            </div>

            {editMode === 'personal' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A535C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <input
                    type="text"
                    value={formData.gender || ''}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A535C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ethnicity</label>
                  <input
                    type="text"
                    value={formData.ethnicity || ''}
                    onChange={(e) => setFormData({ ...formData, ethnicity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A535C] focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave('personal')}
                    className="flex-1 bg-gradient-to-r from-[#1A535C] to-[#2d8659] text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditMode(null)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium text-gray-900">{user.phone || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gender:</span>
                  <span className="font-medium text-gray-900">{user.gender || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ethnicity:</span>
                  <span className="font-medium text-gray-900">{user.ethnicity || 'Not set'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Interests */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Interests</h2>
              <button
                onClick={() => handleEdit('interests')}
                className="text-[#1A535C] hover:text-[#2d8659] transition-colors"
              >
                <Edit2 size={18} />
              </button>
            </div>

            {editMode === 'interests' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Major</label>
                  <input
                    type="text"
                    value={formData.intended_major || ''}
                    onChange={(e) => setFormData({ ...formData, intended_major: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A535C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Major</label>
                  <input
                    type="text"
                    value={formData.alternate_major || ''}
                    onChange={(e) => setFormData({ ...formData, alternate_major: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A535C] focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave('interests')}
                    className="flex-1 bg-gradient-to-r from-[#1A535C] to-[#2d8659] text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditMode(null)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Preferred Major:</span>
                  <span className="font-medium text-gray-900">{user.intended_major || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Alternate Major:</span>
                  <span className="font-medium text-gray-900">{user.alternate_major || 'Not set'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;