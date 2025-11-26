import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Save, X, ArrowLeft } from 'lucide-react';
import api from '../../services/api';

const CollegeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    short_name: '',
    location: '',
    state: '',
    type: 'Public',
    enrollment: 0,
    acceptance_rate: 0,
    tuition_in_state: 0,
    tuition_out_state: 0,
    sat_range: '',
    act_range: '',
    graduation_rate: 0,
    ranking: null,
    rating: '',
    image: '',
    description: '',
    direct_admission: false,
    majors: [],
    features: [],
  });

  const [majorsInput, setMajorsInput] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');

  const loadCollege = useCallback(async () => {
    try {
      const response = await api.get(`/colleges/${id}`);
      const college = response.data;
      setFormData(college);
      setMajorsInput(college.majors.join(', '));
      setFeaturesInput(college.features.join(', '));
    } catch (error) {
      console.error('Failed to load college:', error);
      alert('Failed to load college data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Parse majors and features from comma-separated strings
      const dataToSubmit = {
        ...formData,
        majors: majorsInput.split(',').map((m) => m.trim()).filter(Boolean),
        features: featuresInput.split(',').map((f) => f.trim()).filter(Boolean),
        enrollment: parseInt(formData.enrollment) || 0,
        acceptance_rate: parseFloat(formData.acceptance_rate) || 0,
        tuition_in_state: parseInt(formData.tuition_in_state) || 0,
        tuition_out_state: parseInt(formData.tuition_out_state) || 0,
        graduation_rate: parseFloat(formData.graduation_rate) || 0,
        ranking: formData.ranking ? parseInt(formData.ranking) : null,
      };

      if (isEdit) {
        await api.put(`/admin/colleges/${id}`, dataToSubmit);
      } else {
        await api.post('/admin/colleges', dataToSubmit);
      }

      navigate('/admin/colleges');
    } catch (error) {
      console.error('Failed to save college:', error);
      alert('Failed to save college. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/colleges"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit College' : 'Add New College'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? 'Update college information' : 'Create a new college entry'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-8">
        {/* Basic Information */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                College Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                placeholder="e.g., Stanford University"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Short Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="short_name"
                value={formData.short_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                placeholder="e.g., Stanford"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                placeholder="e.g., Stanford, CA"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                placeholder="e.g., CA"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enrollment
              </label>
              <input
                type="number"
                name="enrollment"
                value={formData.enrollment}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                placeholder="e.g., 17000"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Acceptance Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                name="acceptance_rate"
                value={formData.acceptance_rate}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                placeholder="e.g., 5.2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Graduation Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                name="graduation_rate"
                value={formData.graduation_rate}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                placeholder="e.g., 94.0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tuition In-State ($)
              </label>
              <input
                type="number"
                name="tuition_in_state"
                value={formData.tuition_in_state}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                placeholder="e.g., 18000"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tuition Out-of-State ($)
              </label>
              <input
                type="number"
                name="tuition_out_state"
                value={formData.tuition_out_state}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                placeholder="e.g., 55000"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ranking
              </label>
              <input
                type="number"
                name="ranking"
                value={formData.ranking || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                placeholder="e.g., 5"
              />
            </div>
          </div>
        </div>

        {/* Test Scores */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Test Scores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                SAT Range
              </label>
              <input
                type="text"
                name="sat_range"
                value={formData.sat_range}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                placeholder="e.g., 1420-1570"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ACT Range
              </label>
              <input
                type="text"
                name="act_range"
                value={formData.act_range}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                placeholder="e.g., 32-35"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rating
              </label>
              <input
                type="text"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                placeholder="e.g., A+"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
            placeholder="Brief description of the college..."
          />
        </div>

        {/* Majors & Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Majors (comma-separated)
            </label>
            <textarea
              value={majorsInput}
              onChange={(e) => setMajorsInput(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
              placeholder="e.g., Computer Science, Business, Engineering"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Features (comma-separated)
            </label>
            <textarea
              value={featuresInput}
              onChange={(e) => setFeaturesInput(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
              placeholder="e.g., Research opportunities, Study abroad programs"
            />
          </div>
        </div>

        {/* Options */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="direct_admission"
              checked={formData.direct_admission}
              onChange={handleChange}
              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-sm font-semibold text-gray-700">Direct Admission Available</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:bg-gray-400 transition-colors font-medium shadow-lg"
          >
            <Save size={20} />
            <span>{saving ? 'Saving...' : isEdit ? 'Update College' : 'Create College'}</span>
          </button>
          <Link
            to="/admin/colleges"
            className="flex items-center gap-2 px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            <X size={20} />
            <span>Cancel</span>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CollegeForm;
