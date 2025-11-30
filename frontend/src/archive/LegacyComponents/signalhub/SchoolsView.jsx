// ARCHIVED: Legacy Signal Hub component (pre-cleanup). Do not use in production.
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, DollarSign, GraduationCap, X } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'sonner';

const SchoolsView = () => {
  const [savedColleges, setSavedColleges] = useState([]);
  const [collegeStatuses, setCollegeStatuses] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedColleges();
  }, []);

  const fetchSavedColleges = async () => {
    try {
      const response = await api.get('/api/users/saved-colleges');
      setSavedColleges(response.data);

      // Fetch statuses for each college
      const statuses = {};
      for (const college of response.data) {
        try {
          const statusRes = await api.get(`/api/saved-colleges/${college.id}/status`);
          statuses[college.id] = statusRes.data.status;
        } catch (error) {
          statuses[college.id] = 'Considering';
        }
      }
      setCollegeStatuses(statuses);
    } catch (error) {
      console.error('Failed to load saved colleges:', error);
      toast.error('Failed to load colleges');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (collegeId, newStatus) => {
    try {
      await api.put(`/api/saved-colleges/${collegeId}/status`, { status: newStatus });
      setCollegeStatuses({ ...collegeStatuses, [collegeId]: newStatus });
      toast.success('Status updated!');
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleRemoveCollege = async (collegeId) => {
    try {
      await api.delete(`/api/users/saved-colleges/${collegeId}`);
      setSavedColleges(savedColleges.filter(c => c.id !== collegeId));
      toast.success('College removed from list');
    } catch (error) {
      console.error('Failed to remove college:', error);
      toast.error('Failed to remove college');
    }
  };

  const statusOptions = [
    'Considering',
    'Applied',
    'Accepted',
    'Waitlisted',
    'Denied',
    'Attending'
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Considering': 'bg-gray-100 text-gray-700',
      'Applied': 'bg-blue-100 text-blue-700',
      'Accepted': 'bg-green-100 text-green-700',
      'Waitlisted': 'bg-yellow-100 text-yellow-700',
      'Denied': 'bg-red-100 text-red-700',
      'Attending': 'bg-purple-100 text-purple-700'
    };
    return colors[status] || colors['Considering'];
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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Schools</h1>
        <Link
          to="/colleges"
          className="bg-gradient-to-r from-[#1A535C] to-[#2d8659] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          View Your Matches
        </Link>
      </div>

      {/* Schools List */}
      {savedColleges.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <GraduationCap className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Saved Schools Yet</h3>
          <p className="text-gray-600 mb-6">Start exploring colleges and save your favorites here</p>
          <Link
            to="/colleges"
            className="inline-block bg-gradient-to-r from-[#1A535C] to-[#2d8659] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Browse Colleges
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {savedColleges.map((college) => (
            <div
              key={college.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-6">
                {/* College Logo */}
                <div className="flex-shrink-0">
                  <img
                    src={college.image || 'https://images.unsplash.com/photo-1562774053-701939374585?w=200'}
                    alt={college.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>

                {/* College Info */}
                <div className="flex-1">
                  <Link
                    to={`/colleges/${college.id}`}
                    className="hover:text-[#1A535C] transition-colors"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{college.name}</h3>
                  </Link>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span>{college.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign size={16} />
                      <span>Tuition ${college.tuition_in_state?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>Enrollment {college.enrollment?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-start gap-3">
                  <select
                    value={collegeStatuses[college.id] || 'Considering'}
                    onChange={(e) => handleStatusChange(college.id, e.target.value)}
                    className={`px-3 py-2 rounded-lg font-medium text-sm ${getStatusColor(collegeStatuses[college.id] || 'Considering')} border-none focus:ring-2 focus:ring-[#1A535C] cursor-pointer`}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleRemoveCollege(college.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove from list"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchoolsView;