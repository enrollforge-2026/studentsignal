import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

const SignupPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const result = await register(formData);
      if (result.success) {
        navigate('/intake');
      } else {
        setErrors({ submit: result.error || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold" style={{ color: '#10614E' }}>STUDENT</span>
              <span className="text-white px-2 py-1 text-sm font-bold rounded" style={{ backgroundColor: '#10614E' }}>SIGNAL</span>
            </Link>
          </div>

          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold mb-2" style={{ color: '#1A1A1A' }}>Create your account</h1>
            <p style={{ color: '#6B7280' }}>Start discovering your college opportunities</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields - Side by Side */}
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    placeholder="John"
                    className="w-full pl-10 pr-4 py-3 text-sm transition-all"
                    style={{
                      border: errors.first_name ? '1px solid #EF4444' : '1px solid #E2E5E7',
                      borderRadius: '6px',
                      color: '#1A1A1A',
                      backgroundColor: '#FFFFFF'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#10614E'}
                    onBlur={(e) => e.target.style.borderColor = errors.first_name ? '#EF4444' : '#E2E5E7'}
                  />
                </div>
                {errors.first_name && (
                  <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.first_name}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    placeholder="Doe"
                    className="w-full pl-10 pr-4 py-3 text-sm transition-all"
                    style={{
                      border: errors.last_name ? '1px solid #EF4444' : '1px solid #E2E5E7',
                      borderRadius: '6px',
                      color: '#1A1A1A',
                      backgroundColor: '#FFFFFF'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#10614E'}
                    onBlur={(e) => e.target.style.borderColor = errors.last_name ? '#EF4444' : '#E2E5E7'}
                  />
                </div>
                {errors.last_name && (
                  <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.last_name}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 text-sm transition-all"
                  style={{
                    border: errors.email ? '1px solid #EF4444' : '1px solid #E2E5E7',
                    borderRadius: '6px',
                    color: '#1A1A1A',
                    backgroundColor: '#FFFFFF'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#10614E'}
                  onBlur={(e) => e.target.style.borderColor = errors.email ? '#EF4444' : '#E2E5E7'}
                />
              </div>
              {errors.email && (
                <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-12 py-3 text-sm transition-all"
                  style={{
                    border: errors.password ? '1px solid #EF4444' : '1px solid #E2E5E7',
                    borderRadius: '6px',
                    color: '#1A1A1A',
                    backgroundColor: '#FFFFFF'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#10614E'}
                  onBlur={(e) => e.target.style.borderColor = errors.password ? '#EF4444' : '#E2E5E7'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.password}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 text-sm" style={{ backgroundColor: '#FEF2F2', color: '#EF4444', borderRadius: '6px' }}>
                {errors.submit}
              </div>
            )}

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: loading ? '#6B7280' : '#10614E',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.backgroundColor = '#0A4638';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.backgroundColor = '#10614E';
              }}
            >
              {loading ? 'Creating account...' : 'Create account'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Social Signup */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full" style={{ borderTop: '1px solid #E2E5E7' }}></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 text-gray-500" style={{ backgroundColor: '#FFFFFF' }}>Or continue with</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <button
                type="button"
                className="flex items-center justify-center py-2 transition-all"
                style={{
                  border: '1px solid #E2E5E7',
                  borderRadius: '6px',
                  backgroundColor: '#FFFFFF'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#F5F7F8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#FFFFFF'}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
              <button
                type="button"
                className="flex items-center justify-center py-2 transition-all"
                style={{
                  border: '1px solid #E2E5E7',
                  borderRadius: '6px',
                  backgroundColor: '#FFFFFF'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#F5F7F8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#FFFFFF'}
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button
                type="button"
                className="flex items-center justify-center py-2 transition-all"
                style={{
                  border: '1px solid #E2E5E7',
                  borderRadius: '6px',
                  backgroundColor: '#FFFFFF'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#F5F7F8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#FFFFFF'}
              >
                <svg className="w-5 h-5" fill="#000000" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-medium" style={{ color: '#10614E' }}>
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - VISUAL BRAND PANEL */}
      <div 
        className="hidden lg:flex lg:w-1/2 items-center justify-center p-12"
        style={{
          backgroundColor: '#10614E',
          backgroundImage: 'linear-gradient(135deg, #10614E 0%, #0A4638 100%)'
        }}
      >
        <div className="max-w-lg">
          {/* Promo Card */}
          <div 
            className="p-8"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="mb-4">
              <span 
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF'
                }}
              >
                NEW STUDENT
              </span>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-2">
              Start Your College Journey
            </h2>
            
            <p className="text-xl text-white/90 mb-6">
              Join thousands of students
            </p>
            
            <p className="text-white/80 mb-6 leading-relaxed">
              Get personalized college recommendations, track applications, discover scholarships, and connect with your dream schools — all in one place.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div 
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white/90 text-sm">Free college matching & recommendations</p>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white/90 text-sm">Application tracker & deadline alerts</p>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white/90 text-sm">Scholarship discovery & matching</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
