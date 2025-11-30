// StudentIntakeController.jsx
// Main controller for the 4-step student intake flow

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Step1AboutYou from './Step1AboutYou';
import Step2Academics from './Step2Academics';
import Step3Preferences from './Step3Preferences';
import Step4Location from './Step4Location';

const StudentIntakeController = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form data with all 30+ fields predeclared
  const [formData, setFormData] = useState({
    // Step 1: About You (Identity fields)
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: '',
    birthdate: '',
    gender: '',
    ethnicity: '',
    student_type: '', // High School, Transfer, Graduate
    first_gen: '', // First-generation college student (yes/no/unsure)
    consent: false, // Data sharing consent
    
    // Step 2: Academics
    high_school_name: '',
    high_school_grad_year: '',
    gpa: '',
    sat_score: '',
    act_score: '',
    intended_major: '',
    alternate_major: '',
    intended_enrollment_term: '', // Fall, Spring, Summer
    intended_enrollment_year: '',
    colleges_considering: '', // Text field for colleges they're considering
    
    // Step 3: Preferences
    college_size: '', // Small, Medium, Large, Very Large
    distance_from_home: '', // Close, Moderate, Far, Anywhere
    interests: [], // Array of interest tags
    
    // Step 4: Location
    address: '',
    country: 'United States',
    postal_code: '',
    
    // System fields
    profile_picture_url: '',
    onboarding_completed: false
  });

  // Helper: Update a single field in formData
  const updateField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Navigation: Go to next step
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Navigation: Go to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Submit handler (placeholder)
  const handleSubmit = async () => {
    // TODO: Add API call to save profile
    // TODO: Add completion animation
    // TODO: Navigate to dashboard
    console.log('Submit called with data:', formData);
  };

  // Render the appropriate step component
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1AboutYou formData={formData} updateField={updateField} />;
      case 2:
        return <Step2Academics formData={formData} updateField={updateField} />;
      case 3:
        return <Step3Preferences formData={formData} updateField={updateField} />;
      case 4:
        return <Step4Location formData={formData} updateField={updateField} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F7F9' }}>
      <div className="flex min-h-screen">
        {/* Brand Panel (Left Side) */}
        <div className="hidden lg:flex lg:w-1/2 relative" style={{ backgroundColor: '#004C3F' }}>
          <div className="flex flex-col justify-center items-start w-full px-16">
            <div className="mb-8">
              <div className="flex items-center">
                <span className="text-4xl font-bold text-white">STUDENT</span>
                <div className="flex items-center ml-2">
                  <span className="bg-white text-[#004C3F] text-sm px-2 py-1 rounded font-bold">SIGNAL</span>
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
              Find colleges and scholarships that actually fit you.
            </h2>
            <p className="text-lg text-white/80 mb-8">
              One profile. Smarter matches. No spam.
            </p>
            <div className="text-sm text-white/60 italic">
              💡 Takes less than 5 minutes to complete
            </div>
          </div>
        </div>

        {/* Form Panel (Right Side) */}
        <div className="flex-1 flex items-start justify-center px-6 py-12 overflow-y-auto">
          <div 
            className="bg-white w-full" 
            style={{ 
              maxWidth: '552px', 
              padding: '48px', 
              borderRadius: '12px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)', 
              border: '1px solid #E1E4E8' 
            }}
          >
            {/* Step Indicator */}
            <div className="text-sm font-medium mb-6" style={{ color: '#6B7280' }}>
              STEP {currentStep} OF 4
            </div>

            {/* Step Content */}
            {renderStep()}

            {/* Navigation Buttons */}
            <div 
              className="flex items-center justify-between mt-8 pt-6" 
              style={{ borderTop: '1px solid #E1E4E8' }}
            >
              {/* Back Button */}
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="px-6 py-3 font-medium text-sm transition-all"
                  style={{
                    color: '#2A2F35',
                    backgroundColor: 'transparent',
                    border: '1px solid #E1E4E8',
                    borderRadius: '8px'
                  }}
                >
                  Back
                </button>
              )}

              {/* Spacer for first step */}
              {currentStep === 1 && <div></div>}

              {/* Continue or Submit Button */}
              {currentStep < 4 ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-3 font-medium text-sm flex items-center gap-2 transition-all"
                  style={{
                    backgroundColor: '#004C3F',
                    color: 'white',
                    height: '48px',
                    borderRadius: '8px'
                  }}
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-3 font-medium text-sm flex items-center gap-2 transition-all disabled:opacity-50"
                  style={{
                    backgroundColor: '#004C3F',
                    color: 'white',
                    height: '48px',
                    borderRadius: '8px'
                  }}
                >
                  {loading ? 'Completing...' : 'Complete Profile'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentIntakeController;
