import React from 'react';
import StateDropdown from './StateDropdown';

const AddressInput = ({ 
  value = {}, 
  onChange, 
  required = false, 
  className = '' 
}) => {
  const handleFieldChange = (field, fieldValue) => {
    onChange({ ...value, [field]: fieldValue });
  };

  // Validate ZIP code format (5 digits or 5+4 format)
  const isValidZip = (zip) => {
    return /^\d{5}(-\d{4})?$/.test(zip);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Street Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Street Address
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type="text"
          value={value.street || ''}
          onChange={(e) => handleFieldChange('street', e.target.value)}
          placeholder="123 Main St"
          required={required}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A535C] focus:border-transparent"
        />
      </div>

      {/* City and State Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="text"
            value={value.city || ''}
            onChange={(e) => handleFieldChange('city', e.target.value)}
            placeholder="San Francisco"
            required={required}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A535C] focus:border-transparent"
          />
        </div>

        <StateDropdown
          value={value.state || ''}
          onChange={(newState) => handleFieldChange('state', newState)}
          label="State"
          required={required}
        />
      </div>

      {/* ZIP Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ZIP Code
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type="text"
          value={value.zip || ''}
          onChange={(e) => {
            const zip = e.target.value.replace(/[^\d-]/g, ''); // Only allow digits and dash
            handleFieldChange('zip', zip);
          }}
          placeholder="94102"
          required={required}
          pattern="\d{5}(-\d{4})?"
          title="5-digit ZIP code or 5+4 format (e.g., 94102 or 94102-1234)"
          maxLength={10}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A535C] focus:border-transparent"
        />
        {value.zip && !isValidZip(value.zip) && (
          <p className="text-xs text-red-500 mt-1">
            Please enter a valid 5-digit ZIP code (e.g., 94102 or 94102-1234)
          </p>
        )}
      </div>
    </div>
  );
};

export default AddressInput;
