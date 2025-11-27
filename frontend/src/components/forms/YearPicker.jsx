import React from 'react';

const YearPicker = ({ value, onChange, label, placeholder, required = false, className = '', minYear = 1950, maxYear = 2050 }) => {
  const years = [];
  for (let year = maxYear; year >= minYear; year--) {
    years.push(year);
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
        <option value="">{placeholder || 'Select year'}</option>
        {years.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  );
};

export default YearPicker;