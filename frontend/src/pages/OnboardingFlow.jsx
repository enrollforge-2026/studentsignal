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
      const token = localStorage.getItem('token');
      console.log('Submitting onboarding with token:', token ? 'Present' : 'Missing');
      console.log('Onboarding data:', formData);
      
      const response = await api.put('/api/users/onboarding', formData);
      console.log('Onboarding response:', response.data);
      
      setCurrentStep(totalSteps); // Show personalizing screen
      setTimeout(() => {
        navigate('/signal-hub');
      }, 2500);
    } catch (error) {
      console.error('Onboarding submission failed:', error);
      console.error('Error details:', error.response?.data);
      
      // Show user-friendly error
      const errorMsg = error.response?.data?.detail || 'Failed to complete onboarding. Please try again.';
      
      // Create error modal instead of alert
      const modal = document.createElement('div');
      modal.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 30px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); z-index: 10000; max-width: 400px; width: 90%;';
      modal.innerHTML = `
        <h3 style="font-size: 20px; font-weight: bold; color: #ef4444; margin-bottom: 16px;">Submission Error</h3>
        <p style="color: #4a5568; line-height: 1.6; margin-bottom: 20px;">${errorMsg}</p>
        <button onclick="this.parentElement.remove(); document.getElementById('error-overlay').remove();" style="width: 100%; background: #ef4444; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">Try Again</button>
      `;
      
      const overlay = document.createElement('div');
      overlay.id = 'error-overlay';
      overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999;';
      overlay.onclick = () => { modal.remove(); overlay.remove(); };
      
      document.body.appendChild(overlay);
      document.body.appendChild(modal);
      
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
                  className="w-full p-5 text-left border-2 border-gray-200 rounded-2xl hover:border-indigo-500 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <span className="font-semibold text-gray-900 text-lg">{role}</span>
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
                <Label htmlFor="gradYear" className="text-base font-semibold text-gray-700 mb-2 block">High School Graduation Year</Label>
                <Input
                  id="gradYear"
                  type="text"
                  placeholder="2026"
                  value={formData.high_school_grad_year}
                  onChange={(e) => updateField('high_school_grad_year', e.target.value)}
                  className="mt-2 text-lg h-14 px-5 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm hover:border-gray-300"
                />
              </div>
              
              <div>
                <Label htmlFor="enrollYear" className="text-base font-semibold text-gray-700 mb-2 block">Intended Enrollment Year</Label>
                <Input
                  id="enrollYear"
                  type="text"
                  placeholder="2026"
                  value={formData.intended_enrollment_year}
                  onChange={(e) => updateField('intended_enrollment_year', e.target.value)}
                  className="mt-2 text-lg h-14 px-5 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm hover:border-gray-300"
                />
              </div>
              
              <div>
                <Label htmlFor="enrollTerm" className="text-base font-semibold text-gray-700 mb-2 block">Enrollment Term</Label>
                <select
                  id="enrollTerm"
                  value={formData.intended_enrollment_term}
                  onChange={(e) => updateField('intended_enrollment_term', e.target.value)}
                  className="mt-2 w-full h-14 px-5 border-2 border-gray-200 rounded-xl text-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm hover:border-gray-300 bg-white cursor-pointer"
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
                <Label htmlFor="birthdate" className="text-base font-semibold text-gray-700 mb-2 block">Birthdate</Label>
                <Input
                  id="birthdate"
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) => updateField('birthdate', e.target.value)}
                  className="mt-2 h-14 px-5 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm hover:border-gray-300 text-lg"
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
            
            <div className="space-y-5">
              <div>
                <Label htmlFor="country" className="text-base font-semibold text-gray-700 mb-2 block">Country</Label>
                <Input
                  id="country"
                  type="text"
                  value={formData.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  className="mt-2 h-14 px-5 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm hover:border-gray-300 text-lg"
                />
              </div>
              
              <div>
                <Label htmlFor="postalCode" className="text-base font-semibold text-gray-700 mb-2 block">Postal Code</Label>
                <Input
                  id="postalCode"
                  type="text"
                  placeholder="12345"
                  value={formData.postal_code}
                  onChange={(e) => updateField('postal_code', e.target.value)}
                  className="mt-2 h-14 px-5 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm hover:border-gray-300 text-lg"
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
              <Label htmlFor="hsName" className="text-base font-semibold text-gray-700 mb-2 block">High School Name</Label>
              <Input
                id="hsName"
                type="text"
                placeholder="Enter your high school name"
                value={formData.high_school_name}
                onChange={(e) => updateField('high_school_name', e.target.value)}
                className="mt-2 h-14 px-5 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm hover:border-gray-300 text-lg"
              />
              <p className="text-sm text-gray-500 mt-3 ml-1">Start typing to search...</p>
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
              <Label htmlFor="major" className="text-base font-semibold text-gray-700 mb-2 block">Choose a major (or skip if undecided)</Label>
              <Input
                id="major"
                type="text"
                placeholder="e.g., Computer Science"
                value={formData.intended_major}
                onChange={(e) => updateField('intended_major', e.target.value)}
                className="mt-2 h-14 px-5 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm hover:border-gray-300 text-lg"
              />
              <button
                onClick={nextStep}
                className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700 underline underline-offset-4 transition-colors"
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
            
            <div className="space-y-5">
              <div>
                <Label htmlFor="sat" className="text-base font-semibold text-gray-700 mb-2 block">SAT Score <span className="text-sm text-gray-400 font-normal">(optional)</span></Label>
                <Input
                  id="sat"
                  type="text"
                  placeholder="1400"
                  value={formData.sat_score}
                  onChange={(e) => updateField('sat_score', e.target.value)}
                  className="mt-2 h-14 px-5 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm hover:border-gray-300 text-lg"
                />
              </div>
              
              <div>
                <Label htmlFor="act" className="text-base font-semibold text-gray-700 mb-2 block">ACT Score <span className="text-sm text-gray-400 font-normal">(optional)</span></Label>
                <Input
                  id="act"
                  type="text"
                  placeholder="32"
                  value={formData.act_score}
                  onChange={(e) => updateField('act_score', e.target.value)}
                  className="mt-2 h-14 px-5 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm hover:border-gray-300 text-lg"
                />
              </div>
              
              <div>
                <Label htmlFor="gpa" className="text-base font-semibold text-gray-700 mb-2 block">GPA <span className="text-sm text-gray-400 font-normal">(optional)</span></Label>
                <Input
                  id="gpa"
                  type="text"
                  placeholder="3.8"
                  value={formData.gpa}
                  onChange={(e) => updateField('gpa', e.target.value)}
                  className="mt-2 h-14 px-5 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm hover:border-gray-300 text-lg"
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
            
            <div className="space-y-5">
              <div>
                <Label htmlFor="phone" className="text-base font-semibold text-gray-700 mb-2 block">Phone <span className="text-sm text-gray-400 font-normal">(optional)</span></Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="mt-2 h-14 px-5 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm hover:border-gray-300 text-lg"
                />
              </div>
              
              <div>
                <Label htmlFor="gender" className="text-base font-semibold text-gray-700 mb-2 block">Gender</Label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => updateField('gender', e.target.value)}
                  className="mt-2 w-full h-14 px-5 border-2 border-gray-200 rounded-xl text-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm hover:border-gray-300 bg-white cursor-pointer"
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="ethnicity" className="text-base font-semibold text-gray-700 mb-2 block">Ethnicity <span className="text-sm text-gray-400 font-normal">(optional)</span></Label>
                <select
                  id="ethnicity"
                  value={formData.ethnicity}
                  onChange={(e) => updateField('ethnicity', e.target.value)}
                  className="mt-2 w-full h-14 px-5 border-2 border-gray-200 rounded-xl text-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm hover:border-gray-300 bg-white cursor-pointer"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      {/* Progress Bar - Modern Enterprise Style */}
      {currentStep < 10 && (
        <div className="w-full bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700 tracking-wide">STEP {currentStep} OF {totalSteps - 1}</span>
              <span className="text-sm font-semibold text-indigo-600">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full transition-all duration-500 ease-out shadow-lg"
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
          
          {/* Navigation Buttons - Modern Enterprise Style */}
          {currentStep > 1 && currentStep < 10 && (
            <div className="flex gap-4 mt-10 max-w-xl mx-auto">
              {currentStep > 1 && (
                <Button
                  onClick={prevStep}
                  variant="outline"
                  className="flex items-center gap-2 h-14 px-8 rounded-xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold transition-all shadow-sm"
                >
                  <ChevronLeft size={20} />
                  Back
                </Button>
              )}
              
              {currentStep < 9 && (
                <Button
                  onClick={nextStep}
                  className="flex-1 h-14 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                  Next
                  <ChevronRight size={20} className="ml-2" />
                </Button>
              )}
              
              {currentStep === 9 && (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 h-14 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? 'Completing...' : 'Complete Profile ✨'}
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
