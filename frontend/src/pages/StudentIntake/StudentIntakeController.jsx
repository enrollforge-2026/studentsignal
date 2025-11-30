// StudentIntakeController.jsx
// Main controller for the 4-step student intake flow

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import confetti from 'canvas-confetti';
import Step1AboutYou from './Step1AboutYou';
import Step2Academics from './Step2Academics';
import Step3Preferences from './Step3Preferences';
import Step4Location from './Step4Location';

const StudentIntakeController = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const [formData, setFormData] = useState({
    // Step 1 — About You
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    birthdate: "",
    gender: "",

    // Step 2 — Academics
    student_type: "",
    high_school_name: "",
    high_school_grad_year: "",
    gpa: "",
    sat_score: "",
    act_score: "",
    intended_major: "",
    alternate_major: "",
    rotc: "",
    preferred_learning_mode: "",

    // Step 3 — Preferences
    college_size: "",
    distance_from_home: "",
    saved_colleges: [],

    // Step 4 — Location & Phone
    phone: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    first_gen: "",
    ethnicity: "",
    consent: false,

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
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F7F9' }}>
      <div className="w-full px-6 py-12">
        <div 
          className="bg-white w-full mx-auto"
          style={{ 
            maxWidth: '552px', 
            padding: '48px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            border: '1px solid #E1E4E8'
          }}
        >
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="flex items-center">
              <span className="text-3xl font-bold" style={{ color: '#004C3F' }}>STUDENT</span>
              <div className="flex items-center ml-1">
                <span className="text-xs px-2 py-1 rounded font-bold text-white" style={{ backgroundColor: '#004C3F' }}>SIGNAL</span>
              </div>
            </div>
          </div>

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
  );
};

export default StudentIntakeController;
