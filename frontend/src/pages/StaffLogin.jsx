import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock } from 'lucide-react';

const StaffLogin = () => {
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
      const result = await login(formData);
      if (result.success) {
        // Check if user is admin
        if (result.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          setErrors({ submit: 'Unauthorized. Admin access required.' });
        }
      } else {
        setErrors({ submit: result.error || 'Invalid email or password. Please try again.' });
      }
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
            maxWidth: '420px', 
            padding: '60px 48px 48px 48px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            border: '1px solid #E1E4E8'
          }}
        >
          {/* Title */}
          <h1 className="text-3xl font-bold mb-2 text-center" style={{ color: '#2A2F35' }}>
            Staff Login
          </h1>
          <p className="text-base mb-1 text-center" style={{ color: '#6B7280' }}>
            Access your StudentSignal admin portal.
          </p>
          <p className="text-sm mb-8 text-center" style={{ color: '#6B7280', fontWeight: 400 }}>
            Authorized personnel only.
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
              placeholder="admin@studentsignal.com"
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

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full font-medium text-sm transition-all disabled:opacity-50"
              style={{ 
                backgroundColor: '#004C3F', 
                color: 'white',
                height: '48px',
                borderRadius: '4px'
              }}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="text-center" style={{ marginTop: '24px' }}>
            <Link 
              to="/forgot-password" 
              className="text-sm font-medium transition-colors"
              style={{ color: '#6B7280' }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Return to Student Login */}
          <div className="mt-8 text-center pt-6" style={{ borderTop: '1px solid #E1E4E8' }}>
            <Link 
              to="/login" 
              className="text-sm font-medium transition-colors"
              style={{ color: '#004C3F' }}
            >
              ← Return to Student Login
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

export default StaffLogin;
