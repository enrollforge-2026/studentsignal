// Step4Location.jsx
// Step 4: Location & Contact

import React from 'react';
import { Phone, MapPin, Users, Globe } from 'lucide-react';

const Step4Location = ({ formData, updateField }) => {
  const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2" style={{ color: '#2A2F35' }}>
        Location & Contact
      </h1>
      <p className="text-base mb-8" style={{ color: '#6B7280' }}>
        How can we reach you?
      </p>

      <div className="space-y-6">
        {/* Phone */}
        <InputField
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          icon={<Phone size={20} />}
          placeholder="(555) 555-5555"
          required
        />

        {/* Address */}
        <InputField
          label="Address"
          value={formData.address}
          onChange={(e) => updateField('address', e.target.value)}
          icon={<MapPin size={20} />}
        />

        {/* City and State side by side */}
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="City"
            value={formData.city}
            onChange={(e) => updateField('city', e.target.value)}
          />
          <SelectField
            label="State"
            value={formData.state}
            onChange={(e) => updateField('state', e.target.value)}
          >
            <option value="">Select state</option>
            {usStates.map((state, idx) => (
              <option key={idx} value={state}>{state}</option>
            ))}
          </SelectField>
        </div>

        {/* Postal Code */}
        <InputField
          label="Postal Code"
          value={formData.postal_code}
          onChange={(e) => updateField('postal_code', e.target.value)}
          placeholder="e.g., 90210"
          required
        />

        {/* First Generation */}
        <SelectField
          label="Are you a first-generation college student?"
          value={formData.first_gen}
          onChange={(e) => updateField('first_gen', e.target.value)}
          icon={<Users size={20} />}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="Unsure">Unsure</option>
        </SelectField>

        {/* Ethnicity */}
        <SelectField
          label="Ethnicity"
          value={formData.ethnicity}
          onChange={(e) => updateField('ethnicity', e.target.value)}
          icon={<Globe size={20} />}
        >
          <option value="">Select ethnicity</option>
          <option value="African American">African American</option>
          <option value="Hispanic / Latino">Hispanic / Latino</option>
          <option value="White">White</option>
          <option value="Asian">Asian</option>
          <option value="Native American">Native American</option>
          <option value="Pacific Islander">Pacific Islander</option>
          <option value="Middle Eastern">Middle Eastern</option>
          <option value="Other">Other</option>
          <option value="Prefer Not To Say">Prefer Not To Say</option>
        </SelectField>

        {/* Consent Checkbox */}
        <div className="pt-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.consent}
              onChange={(e) => updateField('consent', e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-2 accent-[#004C3F] flex-shrink-0"
              style={{ borderColor: '#E1E4E8' }}
            />
            <div>
              <span className="text-xs" style={{ color: '#2A2F35', lineHeight: '1.5' }}>
                I agree to receive college opportunities and scholarships. <span style={{ color: '#D92D20' }}>*</span>
              </span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, icon, required, ...props }) => (
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
      <input
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
      />
    </div>
  </div>
);

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

export default Step4Location;
