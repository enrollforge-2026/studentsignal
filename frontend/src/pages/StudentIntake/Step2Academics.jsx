// Step2Academics.jsx
// Step 2: Academics

import React from 'react';
import { GraduationCap, Building2, Target, BookOpen } from 'lucide-react';
import SelectField from '../../components/ui/SelectField';

const Step2Academics = ({ formData, updateField }) => {
  // Generate years 2000-2030
  const gradYears = [];
  for (let year = 2000; year <= 2030; year++) {
    gradYears.push(year.toString());
  }

  const studentTypeOptions = [
    'High School Student',
    'Transfer Student',
    'Adult Learner',
    'College Student',
    'Graduate Candidate'
  ];

  const gpaOptions = ['4.0', '3.75', '3.5', '3.25', '3.0', '2.75', '2.5', '2.0'];

  const rotcOptions = ['Yes', 'No'];

  const educationFormatOptions = [
    'On Campus',
    'Online',
    'Hybrid',
    'HyFlex',
    'Learn Anywhere'
  ];

  const majorOptions = [
    'Accounting',
    'Anthropology',
    'Architecture',
    'Art History',
    'Biology',
    'Business Administration',
    'Chemistry',
    'Civil Engineering',
    'Communications',
    'Computer Science',
    'Criminal Justice',
    'Economics',
    'Electrical Engineering',
    'English',
    'Environmental Science',
    'Finance',
    'Graphic Design',
    'History',
    'Information Technology',
    'International Relations',
    'Journalism',
    'Marketing',
    'Mathematics',
    'Mechanical Engineering',
    'Music',
    'Nursing',
    'Philosophy',
    'Physics',
    'Political Science',
    'Psychology',
    'Public Health',
    'Sociology',
    'Theater',
    'Undecided'
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2" style={{ color: '#2A2F35' }}>
        Academics
      </h1>
      <p className="text-base mb-6" style={{ color: '#6B7280' }}>
        Tell us about your educational background
      </p>

      <div className="space-y-4">
        {/* Block A — High School & Academics */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3" style={{ color: '#004C3F' }}>
            High School & Academics
          </h3>
          <div className="space-y-3">
            {/* Student Type */}
            <SelectField
              label="Student Type"
              value={formData.student_type}
              onChange={(value) => updateField('student_type', value)}
              options={studentTypeOptions}
              icon={<GraduationCap size={20} />}
              placeholder="Select student type"
              required
            />

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
              onChange={(value) => updateField('high_school_grad_year', value)}
              options={gradYears}
              placeholder="Select year"
              required
            />

            {/* GPA */}
            <SelectField
              label="GPA"
              value={formData.gpa}
              onChange={(value) => updateField('gpa', value)}
              options={gpaOptions}
              icon={<Target size={20} />}
              placeholder="Select GPA"
              required
            />

            {/* SAT Score */}
            <InputField
              label="SAT Score"
              type="number"
              value={formData.sat_score}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (parseInt(value) >= 400 && parseInt(value) <= 1600)) {
                  updateField('sat_score', value);
                }
              }}
              placeholder="400-1600"
              min="400"
              max="1600"
            />

            {/* ACT Score */}
            <InputField
              label="ACT Score"
              type="number"
              value={formData.act_score}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 36)) {
                  updateField('act_score', value);
                }
              }}
              placeholder="1-36"
              min="1"
              max="36"
            />
          </div>
        </div>

        {/* Block B — Majors & Programs */}
        <div>
          <h3 className="text-sm font-semibold mb-3" style={{ color: '#004C3F' }}>
            Majors & Programs
          </h3>
          <div className="space-y-3">
            {/* Intended Major */}
            <SelectField
              label="Intended Major"
              value={formData.intended_major}
              onChange={(value) => updateField('intended_major', value)}
              icon={<BookOpen size={20} />}
              placeholder="Select your major"
              options={majorOptions}
              required
            />

            {/* Alternate Major */}
            <SelectField
              label="Alternate Major"
              value={formData.alternate_major}
              onChange={(value) => updateField('alternate_major', value)}
              icon={<BookOpen size={20} />}
              placeholder="Select alternate major (optional)"
              options={majorOptions}
            />

            {/* ROTC */}
            <SelectField
              label="ROTC"
              value={formData.rotc}
              onChange={(value) => updateField('rotc', value)}
              options={rotcOptions}
              placeholder="Select"
            />

            {/* Preferred Learning Mode */}
            <SelectField
              label="Education Format"
              value={formData.preferred_learning_mode}
              onChange={(value) => updateField('preferred_learning_mode', value)}
              options={educationFormatOptions}
              placeholder="Select format"
              required
            />
          </div>
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

export default Step2Academics;
