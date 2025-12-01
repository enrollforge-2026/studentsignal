// Step3Preferences.jsx
// Step 3: Preferences

import React, { useState } from 'react';
import { MapPin, Building } from 'lucide-react';
import SelectField from '../../components/ui/SelectField';

const Step3Preferences = ({ formData, updateField }) => {
  const [collegeInput, setCollegeInput] = useState('');

  // Sample college list for autosuggest (local only)
  const collegeList = [
    'Stanford University',
    'Harvard University',
    'MIT',
    'UC Berkeley',
    'Yale University',
    'Princeton University',
    'Columbia University',
    'University of Pennsylvania',
    'Cornell University',
    'Brown University',
    'Dartmouth College',
    'Duke University',
    'Northwestern University',
    'University of Chicago',
    'Johns Hopkins University'
  ];

  const addCollege = (collegeName) => {
    if (formData.saved_colleges.length < 5 && !formData.saved_colleges.includes(collegeName)) {
      updateField('saved_colleges', [...formData.saved_colleges, collegeName]);
      setCollegeInput('');
    }
  };

  const removeCollege = (collegeName) => {
    updateField('saved_colleges', formData.saved_colleges.filter(c => c !== collegeName));
  };

  const filteredColleges = collegeInput
    ? collegeList.filter(c => c.toLowerCase().includes(collegeInput.toLowerCase()))
    : [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2" style={{ color: '#2A2F35' }}>
        Preferences
      </h1>
      <p className="text-base mb-8" style={{ color: '#6B7280' }}>
        What are you looking for in a college?
      </p>

      <div className="space-y-6">
        {/* College Size */}
        <SelectField
          label="College Size"
          value={formData.college_size}
          onChange={(e) => updateField('college_size', e.target.value)}
          icon={<Building size={20} />}
        >
          <option value="">Select size preference</option>
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Large">Large</option>
          <option value="Very Large">Very Large</option>
        </SelectField>

        {/* Distance from Home */}
        <SelectField
          label="Distance from Home"
          value={formData.distance_from_home}
          onChange={(e) => updateField('distance_from_home', e.target.value)}
          icon={<MapPin size={20} />}
        >
          <option value="">Select distance preference</option>
          <option value="Close to home">Close to home</option>
          <option value="Moderate distance">Moderate distance</option>
          <option value="Far from home">Far from home</option>
          <option value="Anywhere">Anywhere</option>
        </SelectField>

        {/* Saved Colleges */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#2A2F35' }}>
            Colleges You're Considering (up to 5)
          </label>
          <div className="relative">
            <input
              type="text"
              value={collegeInput}
              onChange={(e) => setCollegeInput(e.target.value)}
              placeholder="Start typing a college name…"
              className="w-full text-sm transition-all pl-4 pr-4"
              style={{
                height: '48px',
                border: '1px solid #E1E4E8',
                borderRadius: '12px',
                color: '#2A2F35',
                backgroundColor: 'white',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.border = '2px solid #004C3F';
              }}
              onBlur={(e) => {
                setTimeout(() => {
                  e.target.style.border = '1px solid #E1E4E8';
                }, 200);
              }}
            />
            {/* Dropdown suggestions */}
            {collegeInput && filteredColleges.length > 0 && (
              <div
                className="absolute z-10 w-full mt-1 bg-white shadow-lg"
                style={{
                  border: '1px solid #E1E4E8',
                  borderRadius: '12px',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}
              >
                {filteredColleges.map((college, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-3 cursor-pointer hover:bg-gray-50 text-sm"
                    style={{ color: '#2A2F35' }}
                    onClick={() => addCollege(college)}
                  >
                    {college}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected colleges as pill chips */}
          {formData.saved_colleges.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.saved_colleges.map((college, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium"
                  style={{
                    backgroundColor: '#F0FDF4',
                    color: '#004C3F',
                    border: '1px solid #004C3F',
                    borderRadius: '8px'
                  }}
                >
                  {college}
                  <button
                    onClick={() => removeCollege(college)}
                    className="text-sm font-bold"
                    style={{ color: '#004C3F' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SelectField = ({ label, icon, required, children, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-2" style={{ color: '#2A2F35' }}>
      {label} {required && <span style={{ color: '#D92D20' }}>*</span>}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }}>
          {icon}
        </div>
      )}
      <select
        {...props}
        className={`w-full text-sm transition-all ${icon ? 'pl-12' : 'pl-4'} pr-4`}
        style={{
          height: '48px',
          border: '1px solid #E1E4E8',
          borderRadius: '12px',
          color: '#2A2F35',
          backgroundColor: 'white',
          outline: 'none',
        }}
        onFocus={(e) => {
          e.target.style.border = '2px solid #004C3F';
        }}
        onBlur={(e) => {
          e.target.style.border = '1px solid #E1E4E8';
        }}
      >
        {children}
      </select>
    </div>
  </div>
);

export default Step3Preferences;
