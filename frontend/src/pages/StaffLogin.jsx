import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Shield } from 'lucide-react';

const StaffLogin = () => {
  const navigate = useNavigate();
  const { staffLogin } = useAuth();
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
      const result = await staffLogin(formData);
      if (result.success) {
        navigate('/admin');
      } else {
        setErrors({ submit: result.error || 'Invalid credentials. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'Invalid credentials. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{ 
        backgroundColor: '#F5F7F8',
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(16, 97, 78, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(16, 97, 78, 0.03) 0%, transparent 50%)'
      }}
    >
      <div 
        className="w-full max-w-md"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: '1px solid #E2E5E7'
        }}
      >
        {/* Header */}
        <div 
          className="px-8 py-6 border-b"
          style={{ borderColor: '#E2E5E7' }}
        >
          <div className="flex items-center justify-center mb-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#F5F7F8' }}
            >
              <Shield size={24} style={{ color: '#10614E' }} />
            </div>
          </div>
          <h1 
            className="text-xl font-semibold text-center tracking-wide"
            style={{ color: '#1A1A1A', letterSpacing: '0.5px' }}
          >
            STAFF ACCESS PORTAL
          </h1>
          <p 
            className="text-center text-sm mt-2"
            style={{ color: '#6B7280' }}
          >
            Authorized personnel only
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Email Field */}
          <div>
            <label 
              className="block text-xs font-medium mb-2 uppercase tracking-wide"
              style={{ color: '#6B7280' }}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail 
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                size={18}
                style={{ color: '#9CA3AF' }}
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="staff@organization.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm transition-all"
                style={{
                  border: errors.email ? '1px solid #EF4444' : '1px solid #E2E5E7',
                  borderRadius: '6px',
                  color: '#1A1A1A',
                  backgroundColor: '#FFFFFF'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10614E';
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 97, 78, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.email ? '#EF4444' : '#E2E5E7';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            {errors.email && (
              <p className="text-xs mt-1.5" style={{ color: '#EF4444' }}>{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label 
              className="block text-xs font-medium mb-2 uppercase tracking-wide"
              style={{ color: '#6B7280' }}
            >
              Password
            </label>
            <div className="relative">
              <Lock 
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                size={18}
                style={{ color: '#9CA3AF' }}
              />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm transition-all"
                style={{
                  border: errors.password ? '1px solid #EF4444' : '1px solid #E2E5E7',
                  borderRadius: '6px',
                  color: '#1A1A1A',
                  backgroundColor: '#FFFFFF'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10614E';
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 97, 78, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.password ? '#EF4444' : '#E2E5E7';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            {errors.password && (
              <p className="text-xs mt-1.5" style={{ color: '#EF4444' }}>{errors.password}</p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div 
              className="p-3 text-sm flex items-start gap-2"
              style={{ 
                backgroundColor: '#FEF2F2', 
                color: '#EF4444', 
                borderRadius: '6px',
                border: '1px solid #FEE2E2'
              }}
            >
              <Shield size={16} className="flex-shrink-0 mt-0.5" />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-semibold text-white transition-all uppercase tracking-wide"
            style={{
              backgroundColor: loading ? '#6B7280' : '#10614E',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#0A4638';
                e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#10614E';
                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }
            }}
          >
            {loading ? 'Authenticating...' : 'Access Portal'}
          </button>
        </form>

        {/* Footer */}
        <div 
          className="px-8 py-4 border-t text-center"
          style={{ borderColor: '#E2E5E7', backgroundColor: '#F9FAFB' }}
        >
          <p className="text-xs" style={{ color: '#9CA3AF' }}>
            Protected system · Authorized access only
          </p>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
