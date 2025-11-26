import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    user_role: '',
    self_description: '',
    high_school_grad_year: '',
    intended_enrollment_year: '',
    intended_enrollment_term: 'Fall',
    birthdate: '',
    country: 'United States',
    postal_code: '',
    high_school_name: '',
    intended_major: '',
    sat_score: '',
    act_score: '',
    gpa: '',
    phone: '',
    gender: '',
    ethnicity: ''
  });

  const totalSteps = 10;
  const progress = (currentStep / totalSteps) * 100;

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.put('/api/users/onboarding', formData);
      setCurrentStep(totalSteps); // Show personalizing screen
      setTimeout(() => {
        navigate('/signal-hub');
      }, 2500);
    } catch (error) {
      console.error('Onboarding error:', error);
      alert('Failed to complete onboarding. Please try again.');
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        // Role Selection
        return (
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">👋</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to StudentSignal!</h1>
              <p className="text-lg text-gray-600">Let's get to know you better</p>
            </div>
            
            <div className="space-y-3">
              <p className="text-left text-sm font-medium text-gray-700 mb-3">I am a...</p>
              {['Prospective Student', 'Parent/Guardian', 'Other'].map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    updateField('user_role', role);
                    nextStep();
                  }}
                  className="w-full p-4 text-left border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <span className="font-medium text-gray-900">{role}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        // Self Description
        return (
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎓</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Tell us about yourself</h1>
              <p className="text-lg text-gray-600">Where are you in your academic journey?</p>
            </div>
            
            <div className="space-y-3">
              {['Middle School', 'High School', 'College Student', 'Adult Learner'].map((desc) => (
                <button
                  key={desc}
                  onClick={() => {
                    updateField('self_description', desc);
                    nextStep();
                  }}
                  className={`w-full p-4 text-left border-2 rounded-xl transition-all ${
                    formData.self_description === desc
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-500 hover:bg-purple-50'
                  }`}
                >
                  <span className="font-medium text-gray-900">{desc}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        // Graduation & Enrollment
        return (
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📅</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Timeline</h1>
              <p className="text-lg text-gray-600">When do you plan to start college?</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="gradYear" className="text-base">High School Graduation Year</Label>
                <Input
                  id="gradYear"
                  type="text"
                  placeholder="2026"
                  value={formData.high_school_grad_year}
                  onChange={(e) => updateField('high_school_grad_year', e.target.value)}
                  className="mt-2 text-lg"
                />
              </div>
              
              <div>
                <Label htmlFor="enrollYear" className="text-base">Intended Enrollment Year</Label>
                <Input
                  id="enrollYear"
                  type="text"
                  placeholder="2026"
                  value={formData.intended_enrollment_year}
                  onChange={(e) => updateField('intended_enrollment_year', e.target.value)}
                  className="mt-2 text-lg"
                />
              </div>
              
              <div>
                <Label htmlFor="enrollTerm" className="text-base">Enrollment Term</Label>
                <select
                  id="enrollTerm"
                  value={formData.intended_enrollment_term}
                  onChange={(e) => updateField('intended_enrollment_term', e.target.value)}
                  className="mt-2 w-full p-3 border border-gray-300 rounded-md text-lg"
                >
                  <option value="Fall">Fall</option>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 4:
        // Personal Info
        return (
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">👤</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Personal Information</h1>
              <p className="text-lg text-gray-600">Help us personalize your experience</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="birthdate">Birthdate</Label>
                <Input
                  id="birthdate"
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) => updateField('birthdate', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        // Location
        return (
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🌍</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Where are you from?</h1>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  type="text"
                  value={formData.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  type="text"
                  placeholder="12345"
                  value={formData.postal_code}
                  onChange={(e) => updateField('postal_code', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        // High School
        return (
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🏫</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your High School</h1>
            </div>
            
            <div>
              <Label htmlFor="hsName">High School Name</Label>
              <Input
                id="hsName"
                type="text"
                placeholder="Enter your high school name"
                value={formData.high_school_name}
                onChange={(e) => updateField('high_school_name', e.target.value)}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-2">Start typing to search...</p>
            </div>
          </div>
        );

      case 7:
        // Major
        return (
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📚</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Intended Major</h1>
              <p className="text-lg text-gray-600">What would you like to study?</p>
            </div>
            
            <div>
              <Label htmlFor="major">Choose a major (or skip if undecided)</Label>
              <Input
                id="major"
                type="text"
                placeholder="e.g., Computer Science"
                value={formData.intended_major}
                onChange={(e) => updateField('intended_major', e.target.value)}
                className="mt-1"
              />
              <button
                onClick={nextStep}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Skip - I'm undecided
              </button>
            </div>
          </div>
        );

      case 8:
        // Test Scores
        return (
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📝</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Academic Profile</h1>
              <p className="text-lg text-gray-600">Share your scores (all optional)</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="sat">SAT Score (optional)</Label>
                <Input
                  id="sat"
                  type="text"
                  placeholder="1400"
                  value={formData.sat_score}
                  onChange={(e) => updateField('sat_score', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="act">ACT Score (optional)</Label>
                <Input
                  id="act"
                  type="text"
                  placeholder="32"
                  value={formData.act_score}
                  onChange={(e) => updateField('act_score', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="gpa">GPA (optional)</Label>
                <Input
                  id="gpa"
                  type="text"
                  placeholder="3.8"
                  value={formData.gpa}
                  onChange={(e) => updateField('gpa', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 9:
        // Additional Info
        return (
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">✨</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Almost Done!</h1>
              <p className="text-lg text-gray-600">Just a few more details</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => updateField('gender', e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="ethnicity">Ethnicity (optional)</Label>
                <select
                  id="ethnicity"
                  value={formData.ethnicity}
                  onChange={(e) => updateField('ethnicity', e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select...</option>
                  <option value="Asian">Asian</option>
                  <option value="Black or African American">Black or African American</option>
                  <option value="Hispanic or Latino">Hispanic or Latino</option>
                  <option value="Native American">Native American</option>
                  <option value="Pacific Islander">Pacific Islander</option>
                  <option value="White">White</option>
                  <option value="Two or more races">Two or more races</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 10:
        // Personalizing
        return (
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <span className="text-6xl">🚀</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Alright! Get ready.</h1>
              <p className="text-xl text-gray-600 mb-2">We're personalizing your experience...</p>
              <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto mt-6">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      {/* Progress Bar */}
      {currentStep < 10 && (
        <div className="w-full bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Step {currentStep} of {totalSteps - 1}</span>
              <span className="text-sm font-medium text-gray-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {renderStep()}
          
          {/* Navigation Buttons */}
          {currentStep > 1 && currentStep < 10 && (
            <div className="flex gap-4 mt-8 max-w-xl mx-auto">
              {currentStep > 1 && (
                <Button
                  onClick={prevStep}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ChevronLeft size={20} />
                  Back
                </Button>
              )}
              
              {currentStep < 9 && (
                <Button
                  onClick={nextStep}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Next
                  <ChevronRight size={20} className="ml-2" />
                </Button>
              )}
              
              {currentStep === 9 && (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  {loading ? 'Completing...' : 'Complete Profile'}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
