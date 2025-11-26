import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Save, X, ArrowLeft } from 'lucide-react';
import api from '../../services/api';

const ScholarshipForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    deadline: '',
    type: 'Merit-Based',
    category: 'General',
    description: '',
    eligibility: [],
    renewable: false,
    application_required: true,
    image: '',
  });

  const [eligibilityInput, setEligibilityInput] = useState('');

  useEffect(() => {
    if (isEdit) {
      loadScholarship();
    }
  }, [id, isEdit]);

  const loadScholarship = async () => {
    try {
      const response = await api.get(`/scholarships/${id}`);
      const scholarship = response.data;
      setFormData(scholarship);
      setEligibilityInput(scholarship.eligibility.join(', '));
    } catch (error) {
      console.error('Failed to load scholarship:', error);
      alert('Failed to load scholarship data');
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
      const dataToSubmit = {
        ...formData,
        eligibility: eligibilityInput.split(',').map((e) => e.trim()).filter(Boolean),
      };

      if (isEdit) {
        await api.put(`/admin/scholarships/${id}`, dataToSubmit);
      } else {
        await api.post('/admin/scholarships', dataToSubmit);
      }

      navigate('/admin/scholarships');
    } catch (error) {
      console.error('Failed to save scholarship:', error);
      alert('Failed to save scholarship. Please try again.');
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
          to="/admin/scholarships"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Scholarship' : 'Add New Scholarship'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? 'Update scholarship information' : 'Create a new scholarship entry'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-8">
        {/* Basic Information */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Scholarship Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none"
                placeholder="e.g., National Merit Scholarship"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none"
                placeholder="e.g., $5,000 - $10,000"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Deadline <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none"
                placeholder="e.g., March 15, 2025"
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none"
              >
                <option value="Merit-Based">Merit-Based</option>
                <option value="Need-Based">Need-Based</option>
                <option value="Athletic">Athletic</option>
                <option value="STEM">STEM</option>
                <option value="First Generation">First Generation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none"
                placeholder="e.g., General, Engineering, Arts"
              />
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none"
            placeholder="Brief description of the scholarship..."
          />
        </div>

        {/* Eligibility */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Eligibility Criteria (comma-separated)
          </label>
          <textarea
            value={eligibilityInput}
            onChange={(e) => setEligibilityInput(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none"
            placeholder="e.g., GPA 3.5+, U.S. Citizen, Full-time student"
          />
        </div>

        {/* Options */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="renewable"
              checked={formData.renewable}
              onChange={handleChange}
              className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <span className="text-sm font-semibold text-gray-700">Renewable Scholarship</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="application_required"
              checked={formData.application_required}
              onChange={handleChange}
              className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <span className="text-sm font-semibold text-gray-700">Application Required</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:bg-gray-400 transition-colors font-medium shadow-lg"
          >
            <Save size={20} />
            <span>{saving ? 'Saving...' : isEdit ? 'Update Scholarship' : 'Create Scholarship'}</span>
          </button>
          <Link
            to="/admin/scholarships"
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

export default ScholarshipForm;
