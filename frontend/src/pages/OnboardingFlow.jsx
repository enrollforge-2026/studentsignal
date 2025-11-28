import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Calendar, Users, Building2, GraduationCap, BookOpen, Target, ArrowRight, MapPin } from 'lucide-react';
import api from '../services/api';

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Step 1: Identity
    studentType: '',
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    firstGen: '',
    ethnicity: '',
    
    // Step 2: Academics
    highSchool: '',
    intendedMajors: [],
    startTerm: '',
    startYear: '',
    gpa: '',
    collegesConsidering: '',
    
    // Step 3: Preferences  
    collegeSize: '',
    distanceFromHome: '',
    homeAddress: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.studentType) newErrors.studentType = 'Student type is required';
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    }
    
    if (step === 2) {
      if (!formData.highSchool.trim()) newErrors.highSchool = 'High school is required';
      if (!formData.startTerm) newErrors.startTerm = 'Start term is required';
      if (!formData.startYear) newErrors.startYear = 'Start year is required';
    }
    
    if (step === 3) {
      if (!formData.collegeSize) newErrors.collegeSize = 'College size preference is required';
      if (!formData.distanceFromHome) newErrors.distanceFromHome = 'Distance preference is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setLoading(true);
    try {
      await api.put('/api/user/profile', formData);
      navigate('/signal-hub');
    } catch (error) {
      console.error('Profile update failed:', error);
      setErrors({ submit: 'Failed to save profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // STEP 1 - Two Column Layout with Left Panel
  if (currentStep === 1) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F5F7F9' }}>
        <div className="flex min-h-screen">
          {/* Left Panel - Static Brand Panel */}
          <div className="hidden lg:flex lg:w-1/2 relative" style={{ backgroundColor: '#004C3F' }}>
            <div className="flex flex-col justify-center items-start w-full px-16">
              {/* Logo */}
              <div className="mb-8">
                <div className="flex items-center">
                  <span className="text-4xl font-bold text-white">STUDENT</span>
                  <div className="flex items-center ml-2">
                    <span className="bg-white text-[#004C3F] text-sm px-2 py-1 rounded font-bold">SIGNAL</span>
                  </div>
                </div>
              </div>
              
              {/* Headline */}
              <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                Find colleges and scholarships that actually fit you.
              </h2>
              
              {/* Subtext */}
              <p className="text-lg text-white/80 mb-8">
                One profile. Smarter matches. No spam.
              </p>
              
              {/* Optional Tip */}
              <div className="text-sm text-white/60 italic">
                💡 Takes less than 5 minutes to complete
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="flex-1 flex items-center justify-center px-6 py-12">
            <div 
              className="bg-white w-full"
              style={{ 
                maxWidth: '480px', 
                padding: '48px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                border: '1px solid #E1E4E8'
              }}
            >
              {/* Step Progress */}
              <div className="text-sm font-medium mb-6" style={{ color: '#6B7280' }}>
                STEP 1 OF 3
              </div>
              
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#2A2F35' }}>Identity</h1>
              <p className="text-base mb-8" style={{ color: '#6B7280' }}>Tell us about yourself</p>

              <div className="space-y-6">
                {/* Student Type */}
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: '#2A2F35' }}>
                    Student Type <span style={{ color: '#D92D20' }}>*</span>
                  </label>
                  <div className="flex gap-3">
                    {['High School', 'Transfer', 'Graduate'].map(type => (
                      <button
                        key={type}
                        onClick={() => handleInputChange('studentType', type)}
                        className="flex-1 py-3 px-4 text-sm font-medium transition-all"
                        style={{
                          borderRadius: '12px',
                          border: formData.studentType === type ? '2px solid #004C3F' : '1px solid #E1E4E8',
                          backgroundColor: formData.studentType === type ? '#F0FDF4' : 'white',
                          color: formData.studentType === type ? '#004C3F' : '#2A2F35',
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  {errors.studentType && <p className="text-xs mt-1" style={{ color: '#D92D20' }}>{errors.studentType}</p>}
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    error={errors.firstName}
                    icon={<User size={20} />}
                    required
                  />
                  <InputField
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    error={errors.lastName}
                    icon={<User size={20} />}
                    required
                  />
                </div>

                <InputField
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  icon={<Mail size={20} />}
                  required
                  disabled={!!user?.email}
                />

                <InputField
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  icon={<Phone size={20} />}
                  placeholder="(555) 123-4567"
                />

                <InputField
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  error={errors.dateOfBirth}
                  icon={<Calendar size={20} />}
                  required
                />

                <SelectField
                  label="Gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  icon={<Users size={20} />}
                >
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="other">Other</option>
                </SelectField>

                <SelectField
                  label="Are you a first-generation college student?"
                  value={formData.firstGen}
                  onChange={(e) => handleInputChange('firstGen', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="unsure">Not sure</option>
                </SelectField>

                <SelectField
                  label="Ethnicity"
                  value={formData.ethnicity}
                  onChange={(e) => handleInputChange('ethnicity', e.target.value)}
                >
                  <option value="">Prefer not to say</option>
                  <option value="asian">Asian</option>
                  <option value="black">Black or African American</option>
                  <option value="hispanic">Hispanic or Latino</option>
                  <option value="white">White</option>
                  <option value="native">Native American or Alaska Native</option>
                  <option value="pacific">Native Hawaiian or Pacific Islander</option>
                  <option value="multiple">Two or more races</option>
                </SelectField>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleNext}
                className="w-full mt-8 flex items-center justify-center gap-2 font-medium text-sm transition-all"
                style={{ 
                  backgroundColor: '#004C3F', 
                  color: 'white',
                  height: '48px',
                  borderRadius: '8px'
                }}
              >
                Continue
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2 - Same layout as Step 1 (with static left panel)
  if (currentStep === 2) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F5F7F9' }}>
        <div className="flex min-h-screen">
          {/* Left Panel - Same Static Brand Panel */}
          <div className="hidden lg:flex lg:w-1/2 relative" style={{ backgroundColor: '#004C3F' }}>
            <div className="flex flex-col justify-center items-start w-full px-16">
              {/* Logo */}
              <div className="mb-8">
                <div className="flex items-center">
                  <span className="text-4xl font-bold text-white">STUDENT</span>
                  <div className="flex items-center ml-2">
                    <span className="bg-white text-[#004C3F] text-sm px-2 py-1 rounded font-bold">SIGNAL</span>
                  </div>
                </div>
              </div>
              
              {/* Headline */}
              <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                Find colleges and scholarships that actually fit you.
              </h2>
              
              {/* Subtext */}
              <p className="text-lg text-white/80 mb-8">
                One profile. Smarter matches. No spam.
              </p>
              
              {/* Optional Tip */}
              <div className="text-sm text-white/60 italic">
                💡 Takes less than 5 minutes to complete
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="flex-1 flex items-center justify-center px-6 py-12">
            {/* Form Card */}
            <div 
              className="bg-white w-full"
              style={{ 
                maxWidth: '480px', 
                padding: '48px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                border: '1px solid #E1E4E8'
              }}
            >
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#2A2F35' }}>Academics</h1>
            <p className="text-base mb-8" style={{ color: '#6B7280' }}>Your educational background</p>

            {errors.submit && (
              <div 
                className="mb-6 p-4 text-sm"
                style={{ backgroundColor: '#FEF2F2', color: '#D92D20', border: '1px solid #FECACA', borderRadius: '12px' }}
              >
                {errors.submit}
              </div>
            )}

            <div className="space-y-6">
              <InputField
                label="High School"
                value={formData.highSchool}
                onChange={(e) => handleInputChange('highSchool', e.target.value)}
                error={errors.highSchool}
                icon={<Building2 size={20} />}
                placeholder="Search for your high school"
                required
              />

              <InputField
                label="Intended Majors"
                value={formData.intendedMajors}
                onChange={(e) => handleInputChange('intendedMajors', e.target.value)}
                icon={<BookOpen size={20} />}
                placeholder="e.g., Computer Science, Biology"
              />

              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  label="Start Term"
                  value={formData.startTerm}
                  onChange={(e) => handleInputChange('startTerm', e.target.value)}
                  error={errors.startTerm}
                  required
                >
                  <option value="">Select term</option>
                  <option value="fall">Fall</option>
                  <option value="spring">Spring</option>
                  <option value="summer">Summer</option>
                </SelectField>

                <SelectField
                  label="Start Year"
                  value={formData.startYear}
                  onChange={(e) => handleInputChange('startYear', e.target.value)}
                  error={errors.startYear}
                  required
                >
                  <option value="">Select year</option>
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </SelectField>
              </div>

              <InputField
                label="GPA"
                type="number"
                step="0.01"
                min="0"
                max="4.0"
                value={formData.gpa}
                onChange={(e) => handleInputChange('gpa', e.target.value)}
                icon={<Target size={20} />}
                placeholder="3.5"
              />

              <InputField
                label="Colleges You're Considering"
                value={formData.collegesConsidering}
                onChange={(e) => handleInputChange('collegesConsidering', e.target.value)}
                icon={<GraduationCap size={20} />}
                placeholder="e.g., Stanford, MIT, UC Berkeley"
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: '1px solid #E1E4E8' }}>
              <button
                onClick={handleBack}
                className="px-6 py-3 font-medium text-sm transition-all"
                style={{ color: '#2A2F35', backgroundColor: 'transparent', border: '1px solid #E1E4E8', borderRadius: '8px' }}
              >
                Back
              </button>

              <button
                onClick={handleNext}
                className="px-6 py-3 font-medium text-sm flex items-center gap-2 transition-all"
                style={{ 
                  backgroundColor: '#004C3F', 
                  color: 'white',
                  height: '48px',
                  borderRadius: '8px'
                }}
              >
                Continue
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 3 will be built after screenshot approval
  return <div>Step 3 - To be built</div>;
};

// Step Indicator Component (for Step 1 left panel)
const StepIndicator = ({ number, title, active = false }) => (
  <div className="flex items-center gap-4">
    <div 
      className="flex-shrink-0 w-12 h-12 flex items-center justify-center font-semibold transition-all"
      style={{
        borderRadius: '8px',
        backgroundColor: active ? 'white' : 'transparent',
        color: active ? '#004C3F' : 'rgba(255,255,255,0.5)',
        border: active ? 'none' : '2px solid rgba(255,255,255,0.3)',
      }}
    >
      {number}
    </div>
    <div>
      <h3 className="font-semibold text-lg" style={{ color: active ? 'white' : 'rgba(255,255,255,0.5)' }}>
        {title}
      </h3>
    </div>
  </div>
);

// Input Field Component
const InputField = ({ label, error, icon, required, ...props }) => (
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
          border: error ? '2px solid #D92D20' : '1px solid #E1E4E8',
          borderRadius: '12px',
          color: '#2A2F35',
          backgroundColor: props.disabled ? '#F5F7F9' : 'white',
          outline: 'none',
        }}
        onFocus={(e) => {
          if (!error) e.target.style.border = '2px solid #004C3F';
        }}
        onBlur={(e) => {
          if (!error) e.target.style.border = '1px solid #E1E4E8';
        }}
      />
    </div>
    {error && (
      <p className="text-xs mt-1" style={{ color: '#D92D20' }}>
        {error}
      </p>
    )}
  </div>
);

// Select Field Component
const SelectField = ({ label, error, icon, required, children, ...props }) => (
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
          border: error ? '2px solid #D92D20' : '1px solid #E1E4E8',
          borderRadius: '12px',
          color: '#2A2F35',
          backgroundColor: 'white',
          outline: 'none',
        }}
        onFocus={(e) => {
          if (!error) e.target.style.border = '2px solid #004C3F';
        }}
        onBlur={(e) => {
          if (!error) e.target.style.border = '1px solid #E1E4E8';
        }}
      >
        {children}
      </select>
    </div>
    {error && (
      <p className="text-xs mt-1" style={{ color: '#D92D20' }}>
        {error}
      </p>
    )}
  </div>
);

export default OnboardingFlow;