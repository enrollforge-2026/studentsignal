// Step1AboutYou.jsx
// Step 1: About You

import React from 'react';
import { User, Mail, Calendar, Users } from 'lucide-react';
import SelectField from '../../components/ui/SelectField';

const Step1AboutYou = ({ formData, updateField }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2" style={{ color: '#2A2F35' }}>
        About You
      </h1>
      <p className="text-base mb-4" style={{ color: '#6B7280' }}>
        Let's start with the basics
      </p>
      <p 
        className="text-xs mb-8" 
        style={{ color: '#6B7280', opacity: 0.8, fontSize: '12.5px' }}
      >
        Your information is private. Colleges only receive what you explicitly share.
      </p>

      <div className="space-y-4">
        {/* First Name and Last Name - Side by side */}
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="First Name"
            value={formData.first_name}
            onChange={(e) => updateField('first_name', e.target.value)}
            icon={<User size={20} />}
            placeholder="John"
            required
          />
          <InputField
            label="Last Name"
            value={formData.last_name}
            onChange={(e) => updateField('last_name', e.target.value)}
            icon={<User size={20} />}
            placeholder="Doe"
            required
          />
        </div>

        {/* Email */}
        <InputField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          icon={<Mail size={20} />}
          disabled={!!formData.email}
          required
        />

        {/* Birthdate */}
        <InputField
          label="Date of Birth"
          type="date"
          value={formData.birthdate}
          onChange={(e) => updateField('birthdate', e.target.value)}
          icon={<Calendar size={20} />}
          required
        />

        {/* Gender */}
        <SelectField
          label="Gender"
          value={formData.gender}
          onChange={(e) => updateField('gender', e.target.value)}
          icon={<Users size={20} />}
          required
        >
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Non-Binary">Non-Binary</option>
          <option value="Prefer Not to Say">Prefer Not to Say</option>
        </SelectField>
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
          backgroundColor: props.disabled ? '#F5F7F9' : 'white',
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

export default Step1AboutYou;
