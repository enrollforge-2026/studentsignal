import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../services/api';

const CollegesList = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadColleges();
  }, []);

  const loadColleges = async () => {
    try {
      setLoading(true);
      const response = await api.get('/colleges?limit=100');
      setColleges(response.data.colleges || []);
    } catch (error) {
      console.error('Failed to load colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (collegeId) => {
    try {
      await api.delete(`/admin/colleges/${collegeId}`);
      setColleges(colleges.filter((c) => c.id !== collegeId));
      setDeleteConfirm(null);
      toast.success('College deleted successfully');
    } catch (error) {
      console.error('Failed to delete college:', error);
      toast.error('Failed to delete college. Please try again.');
    }
  };

  const filteredColleges = colleges.filter((college) =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading colleges...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Colleges</h1>
          <p className="text-gray-600">Manage all colleges in the system</p>
        </div>
        <Link
          to="/admin/colleges/new"
          className="flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-xl hover:bg-green-800 transition-colors shadow-lg"
        >
          <Plus size={20} />
          <span className="font-medium">Add New College</span>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search colleges by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">College</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Location</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Type</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Acceptance Rate</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredColleges.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No colleges found
                  </td>
                </tr>
              ) : (
                filteredColleges.map((college) => (
                  <tr key={college.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{college.name}</div>
                      <div className="text-sm text-gray-500">{college.short_name}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{college.location}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          college.type === 'Public'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {college.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{college.acceptance_rate}%</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/college/${college.id}`}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          to={`/admin/colleges/${college.id}/edit`}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(college.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this college? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegesList;
