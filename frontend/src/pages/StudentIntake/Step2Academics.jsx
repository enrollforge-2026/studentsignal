// Step2Academics.jsx
// Step 2: Academics

import React from 'react';
import { GraduationCap, Building2, Target, BookOpen } from 'lucide-react';

const Step2Academics = ({ formData, updateField }) => {
  // Generate years 2000-2030
  const gradYears = [];
  for (let year = 2000; year <= 2030; year++) {
    gradYears.push(year);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2" style={{ color: '#2A2F35' }}>
        Academics
      </h1>
      <p className="text-base mb-8" style={{ color: '#6B7280' }}>
        Tell us about your educational background
      </p>

      <div className="space-y-6">
        {/* Student Type */}
        <SelectField
          label="Student Type"
          value={formData.student_type}
          onChange={(e) => updateField('student_type', e.target.value)}
          icon={<GraduationCap size={20} />}
          required
        >
          <option value="">Select student type</option>
          <option value="High School Student">High School Student</option>
          <option value="Transfer Student">Transfer Student</option>
          <option value="Adult Learner">Adult Learner</option>
          <option value="College Student">College Student</option>
          <option value="Graduate Candidate">Graduate Candidate</option>
        </SelectField>

        {/* High School Name */}
        <InputField
          label="High School Name"
          value={formData.high_school_name}
          onChange={(e) => updateField('high_school_name', e.target.value)}
          icon={<Building2 size={20} />}
          placeholder="Start typing your high school…"
          required
        />

        {/* High School Graduation Year */}
        <SelectField
          label="High School Graduation Year"
          value={formData.high_school_grad_year}
          onChange={(e) => updateField('high_school_grad_year', e.target.value)}
          required
        >
          <option value="">Select year</option>
          {gradYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </SelectField>

        {/* GPA */}
        <SelectField
          label="GPA"
          value={formData.gpa}
          onChange={(e) => updateField('gpa', e.target.value)}
          icon={<Target size={20} />}
          required
        >
          <option value="">Select GPA</option>
          <option value="2.0">2.0</option>
          <option value="2.5">2.5</option>
          <option value="2.75">2.75</option>
          <option value="3.0">3.0</option>
          <option value="3.25">3.25</option>
          <option value="3.5">3.5</option>
          <option value="3.75">3.75</option>
          <option value="4.0">4.0</option>
        </SelectField>

        {/* SAT Score */}
        <InputField
          label="SAT Score"
          type="number"
          value={formData.sat_score}
          onChange={(e) => updateField('sat_score', e.target.value)}
          placeholder="e.g., 1200"
        />

        {/* ACT Score */}
        <InputField
          label="ACT Score"
          type="number"
          value={formData.act_score}
          onChange={(e) => updateField('act_score', e.target.value)}
          placeholder="e.g., 24"
        />

        {/* Intended Major */}
        <InputField
          label="Intended Major"
          value={formData.intended_major}
          onChange={(e) => updateField('intended_major', e.target.value)}
          icon={<BookOpen size={20} />}
          placeholder="Start typing your major…"
          required
        />

        {/* Alternate Major */}
        <InputField
          label="Alternate Major"
          value={formData.alternate_major}
          onChange={(e) => updateField('alternate_major', e.target.value)}
          icon={<BookOpen size={20} />}
          placeholder="Optional"
        />

        {/* ROTC */}
        <SelectField
          label="ROTC"
          value={formData.rotc}
          onChange={(e) => updateField('rotc', e.target.value)}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </SelectField>

        {/* Preferred Learning Mode */}
        <SelectField
          label="Preferred Learning Mode"
          value={formData.preferred_learning_mode}
          onChange={(e) => updateField('preferred_learning_mode', e.target.value)}
          required
        >
          <option value="">Select learning mode</option>
          <option value="In-Person">In-Person</option>
          <option value="Online">Online</option>
          <option value="Hybrid">Hybrid</option>
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

export default Step2Academics;
