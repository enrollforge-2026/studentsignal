import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const GPADropdown = ({ value, onChange, label, placeholder, required = false, className = '' }) => {
  const [gpaOptions, setGpaOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGPAOptions();
  }, []);

  const fetchGPAOptions = async () => {
    try {
      const response = await api.get('/api/reference/gpa-options');
      setGpaOptions(response.data.gpa_options);
    } catch (error) {
      console.error('Failed to load GPA options:', error);
      // Fallback to local generation
      const options = [];
      for (let i = 0; i <= 40; i++) {
        options.push((i * 0.1).toFixed(1));
      }
      setGpaOptions(options);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={className}>
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">Loading...</div>
      </div>
    );
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A535C] focus:border-transparent"
      >
        <option value="">{placeholder || 'Select GPA'}</option>
        {gpaOptions.map(gpa => (
          <option key={gpa} value={gpa}>{gpa}</option>
        ))}
      </select>
    </div>
  );
};

export default GPADropdown;