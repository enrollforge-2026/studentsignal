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

          {/* Title */}
          <h1 className="text-3xl font-bold mb-2 text-center" style={{ color: '#2A2F35' }}>
            Create your account
          </h1>
          <p className="text-base mb-8 text-center" style={{ color: '#6B7280' }}>
            Start discovering your college opportunities.
          </p>

          {/* Error Message */}
          {errors.submit && (
            <div 
              className="mb-6 p-4 text-sm text-center"
              style={{ 
                backgroundColor: '#FEF2F2', 
                color: '#D92D20', 
                border: '1px solid #FECACA', 
                borderRadius: '12px' 
              }}
            >
              {errors.submit}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="First Name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                error={errors.first_name}
                icon={<User size={20} />}
                placeholder="John"
                required
              />
              <InputField
                label="Last Name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                error={errors.last_name}
                icon={<User size={20} />}
                placeholder="Doe"
                required
              />
            </div>

            <InputField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              icon={<Mail size={20} />}
              placeholder="your@email.com"
              required
            />

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2A2F35' }}>
                Password <span style={{ color: '#D92D20' }}>*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }}>
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full text-sm transition-all pl-12 pr-12"
                  style={{
                    height: '48px',
                    border: errors.password ? '2px solid #D92D20' : '1px solid #E1E4E8',
                    borderRadius: '12px',
                    color: '#2A2F35',
                    backgroundColor: 'white',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    if (!errors.password) e.target.style.border = '2px solid #004C3F';
                  }}
                  onBlur={(e) => {
                    if (!errors.password) e.target.style.border = '1px solid #E1E4E8';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#6B7280' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs mt-1" style={{ color: '#D92D20' }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 font-medium text-sm transition-all disabled:opacity-50"
              style={{ 
                backgroundColor: '#004C3F', 
                color: 'white',
                height: '48px',
                borderRadius: '8px'
              }}
            >
              {loading ? 'Creating account...' : 'Create account'}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <span className="text-sm" style={{ color: '#6B7280' }}>
              Already have an account?{' '}
            </span>
            <Link 
              to="/login" 
              className="text-sm font-medium transition-colors"
              style={{ color: '#004C3F' }}
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

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
          backgroundColor: 'white',
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

export default SignupPage;
