import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
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
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/signal-hub');
    } catch (error) {
      setErrors({ submit: 'Invalid email or password. Please try again.' });
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
            Welcome back
          </h1>
          <p className="text-base mb-8 text-center" style={{ color: '#6B7280' }}>
            Log in to access your opportunities.
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

            <InputField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={errors.password}
              icon={<Lock size={20} />}
              placeholder="Enter your password"
              required
            />

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link 
                to="/forgot-password" 
                className="text-sm font-medium transition-colors"
                style={{ color: '#004C3F' }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
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
              {loading ? 'Logging in...' : 'Log in'}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Create Account Link */}
          <div className="mt-8 text-center">
            <span className="text-sm" style={{ color: '#6B7280' }}>
              Don't have an account?{' '}
            </span>
            <Link 
              to="/signup" 
              className="text-sm font-medium transition-colors"
              style={{ color: '#004C3F' }}
            >
              Create account
            </Link>
          </div>

          {/* Staff Login Link */}
          <div className="mt-4 text-center">
            <Link 
              to="/staff-login" 
              className="text-sm font-medium transition-colors"
              style={{ color: '#6B7280' }}
            >
              Staff Login →
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

export default LoginPage;
