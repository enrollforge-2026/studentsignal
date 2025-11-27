import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const StateDropdown = ({ value, onChange, label, placeholder, required = false, className = '' }) => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await api.get('/api/reference/states');
      setStates(response.data.states);
    } catch (error) {
      console.error('Failed to load states:', error);
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
        <option value="">{placeholder || 'Select state'}</option>
        {states.map(state => (
          <option key={state.code} value={state.code}>{state.name} ({state.code})</option>
        ))}
      </select>
    </div>
  );
};

export default StateDropdown;