import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Calendar, Users, Building2, GraduationCap, BookOpen, Target, ArrowRight } from 'lucide-react';
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

  const steps = [
    { number: 1, title: 'Identity', subtitle: 'Tell us about yourself' },
    { number: 2, title: 'Academics', subtitle: 'Your educational background' },
    { number: 3, title: 'Preferences', subtitle: 'Location and interests' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F7F9' }}>
      <div className="flex min-h-screen">
        {/* Left Column - Illustration/Pattern */}
        <div className="hidden lg:flex lg:w-1/2 relative" style={{ backgroundColor: '#004C3F' }}>
          <div className="flex flex-col justify-center items-center w-full px-16">
            {/* Logo */}
            <div className="mb-12">
              <div className="flex items-center">
                <span className="text-4xl font-bold text-white">STUDENT</span>
                <div className="flex items-center ml-2">
                  <span className="bg-white text-[#004C3F] text-sm px-2 py-1 rounded font-bold">SIGNAL</span>
                </div>
              </div>
            </div>
            
            {/* Progress Steps - Vertical */}
            <div className="space-y-8 w-full max-w-sm">
              {steps.map((step) => (
                <div key={step.number} className="flex items-start gap-4">
                  <div 
                    className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-semibold transition-all ${
                      currentStep === step.number 
                        ? 'bg-white text-[#004C3F]' 
                        : currentStep > step.number
                        ? 'bg-[#007B63] text-white'
                        : 'bg-[#004C3F] border-2 border-white/30 text-white/70'
                    }`}
                  >
                    {currentStep > step.number ? <Check size={24} /> : step.number}
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className={`font-semibold text-lg ${
                      currentStep >= step.number ? 'text-white' : 'text-white/50'
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm mt-1 ${
                      currentStep >= step.number ? 'text-white/80' : 'text-white/40'
                    }`}>
                      {step.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Form Card */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div 
            className="bg-white rounded-xl w-full"
            style={{ 
              maxWidth: '480px', 
              padding: '48px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
              border: '1px solid #E1E4E8'
            }}
          >
            {/* Mobile Progress */}
            <div className="lg:hidden mb-8">
              <div className="flex items-center gap-2 mb-2">
                {steps.map((step, idx) => (
                  <React.Fragment key={step.number}>
                    <div 
                      className={`h-2 flex-1 rounded-full transition-all ${
                        currentStep >= step.number ? 'bg-[#004C3F]' : 'bg-[#E1E4E8]'
                      }`}
                    />
                  </React.Fragment>
                ))}
              </div>
              <p className="text-sm font-medium" style={{ color: '#2A2F35' }}>
                Step {currentStep} of {steps.length}
              </p>
            </div>

            {/* Form Content */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#2A2F35' }}>
                {steps[currentStep - 1].title}
              </h1>
              <p className="text-base" style={{ color: '#6B7280' }}>
                {steps[currentStep - 1].subtitle}
              </p>
            </div>

            {errors.submit && (
              <div 
                className="mb-6 p-4 rounded-lg text-sm"
                style={{ backgroundColor: '#FEF2F2', color: '#D92D20', border: '1px solid #FECACA' }}
              >
                {errors.submit}
              </div>
            )}

            {/* Step 1: Identity */}
            {currentStep === 1 && (
              <div className="space-y-6">
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
                  error={errors.phone}
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
              </div>
            )}

            {/* Step 2: Academics */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <InputField
                  label="High School Name"
                  value={formData.highSchoolName}
                  onChange={(e) => handleInputChange('highSchoolName', e.target.value)}
                  error={errors.highSchoolName}
                  icon={<Building2 size={20} />}
                  placeholder="Enter your high school"
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <SelectField
                    label="Graduation Year"
                    value={formData.graduationYear}
                    onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                    error={errors.graduationYear}
                    icon={<GraduationCap size={20} />}
                    required
                  >
                    <option value="">Select year</option>
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </SelectField>
                  
                  <InputField
                    label="GPA (Optional)"
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    value={formData.gpa}
                    onChange={(e) => handleInputChange('gpa', e.target.value)}
                    error={errors.gpa}
                    icon={<Target size={20} />}
                    placeholder="3.5"
                  />
                </div>
                
                <InputField
                  label="Intended Major"
                  value={formData.intendedMajor}
                  onChange={(e) => handleInputChange('intendedMajor', e.target.value)}
                  error={errors.intendedMajor}
                  icon={<BookOpen size={20} />}
                  placeholder="e.g., Computer Science, Biology"
                />
              </div>
            )}

            {/* Step 3: Preferences & Address */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    error={errors.country}
                    icon={<MapPin size={20} />}
                    required
                  />
                  
                  <InputField
                    label="Postal Code"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    error={errors.postalCode}
                    icon={<Home size={20} />}
                    placeholder="12345"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="State/Province"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    error={errors.state}
                    placeholder="California"
                  />
                  
                  <InputField
                    label="City"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    error={errors.city}
                    placeholder="Los Angeles"
                  />
                </div>
                
                <SelectField
                  label="Preferred College Type"
                  value={formData.preferredCollegeType}
                  onChange={(e) => handleInputChange('preferredCollegeType', e.target.value)}
                  error={errors.preferredCollegeType}
                >
                  <option value="">Select preference</option>
                  <option value="public">Public University</option>
                  <option value="private">Private University</option>
                  <option value="liberal-arts">Liberal Arts College</option>
                  <option value="community">Community College</option>
                  <option value="online">Online Programs</option>
                </SelectField>
                
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.financialAidInterest}
                    onChange={(e) => handleInputChange('financialAidInterest', e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-2 accent-[#004C3F]"
                    style={{ borderColor: '#E1E4E8' }}
                  />
                  <div>
                    <span className="font-medium text-sm" style={{ color: '#2A2F35' }}>
                      I'm interested in financial aid and scholarships
                    </span>
                    <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                      We'll help you discover funding opportunities
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: '1px solid #E1E4E8' }}>
              {currentStep > 1 ? (
                <button
                  onClick={handleBack}
                  className="px-6 py-3 font-medium text-sm rounded-lg transition-all"
                  style={{ color: '#2A2F35', backgroundColor: 'transparent', border: '1px solid #E1E4E8' }}
                >
                  Back
                </button>
              ) : (
                <div />
              )}
              
              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 font-medium text-sm rounded-lg flex items-center gap-2 transition-all"
                  style={{ 
                    backgroundColor: '#004C3F', 
                    color: 'white',
                    height: '48px'
                  }}
                >
                  Continue
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-3 font-medium text-sm rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
                  style={{ 
                    backgroundColor: '#004C3F', 
                    color: 'white',
                    height: '48px'
                  }}
                >
                  {loading ? 'Completing...' : 'Complete Setup'}
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
        className={`w-full rounded-lg text-sm transition-all ${icon ? 'pl-12' : 'pl-4'} pr-4`}
        style={{
          height: '48px',
          border: error ? '2px solid #D92D20' : '1px solid #E1E4E8',
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
        className={`w-full rounded-lg text-sm transition-all ${icon ? 'pl-12' : 'pl-4'} pr-4`}
        style={{
          height: '48px',
          border: error ? '2px solid #D92D20' : '1px solid #E1E4E8',
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
