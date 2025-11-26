import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { leadsAPI } from '../services/api';

const LeadCaptureModal = ({ isOpen, onClose, college }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    highSchoolGradYear: '',
    interestedMajor: '',
    consentToContact: true,
    consentToShare: false
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await leadsAPI.createLead({
        college_id: college.id,
        college_name: college.name,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        high_school_grad_year: formData.highSchoolGradYear || null,
        interested_major: formData.interestedMajor || null,
        consent_to_contact: formData.consentToContact,
        consent_to_share: formData.consentToShare
      });

      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          highSchoolGradYear: '',
          interestedMajor: '',
          consentToContact: true,
          consentToShare: false
        });
      }, 2000);
    } catch (err) {
      setError('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Request Information</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
            <p className="text-gray-600">
              {college.name} will reach out to you soon with more information.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-900">
                <strong>{college.name}</strong> would like to send you information about their programs.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="mt-1"
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gradYear">Graduation Year (Optional)</Label>
                <Input
                  id="gradYear"
                  type="text"
                  value={formData.highSchoolGradYear}
                  onChange={(e) => setFormData({...formData, highSchoolGradYear: e.target.value})}
                  className="mt-1"
                  placeholder="2026"
                />
              </div>
              <div>
                <Label htmlFor="major">Intended Major (Optional)</Label>
                <Input
                  id="major"
                  type="text"
                  value={formData.interestedMajor}
                  onChange={(e) => setFormData({...formData, interestedMajor: e.target.value})}
                  className="mt-1"
                  placeholder="Computer Science"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consentToContact}
                  onChange={(e) => setFormData({...formData, consentToContact: e.target.checked})}
                  className="mt-1 w-4 h-4 text-[#1a5d3a] border-gray-300 rounded focus:ring-[#1a5d3a]"
                />
                <span className="text-sm text-gray-700">
                  I consent to be contacted by {college.name} regarding their programs.
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consentToShare}
                  onChange={(e) => setFormData({...formData, consentToShare: e.target.checked})}
                  className="mt-1 w-4 h-4 text-[#1a5d3a] border-gray-300 rounded focus:ring-[#1a5d3a]"
                />
                <span className="text-sm text-gray-700">
                  I consent to share my information with partner institutions for similar opportunities.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading || !formData.consentToContact}
              className="w-full bg-[#1a5d3a] hover:bg-[#2d8659] text-white font-semibold py-3 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By submitting this form, you agree to receive communications from {college.name}.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default LeadCaptureModal;
