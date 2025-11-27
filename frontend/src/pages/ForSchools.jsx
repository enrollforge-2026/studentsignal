import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Building2, Users, TrendingUp, Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';
import InstitutionSearch from '../components/forms/InstitutionSearch';

const ForSchools = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school: '',
    role: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Submit to leads/contact endpoint
      await api.post('/api/leads', {
        first_name: formData.name.split(' ')[0] || formData.name,
        last_name: formData.name.split(' ').slice(1).join(' ') || '',
        email: formData.email,
        college_id: 'schools-inquiry',
        phone: formData.school,
        message: `Role: ${formData.role}\nSchool: ${formData.school}\n\n${formData.message}`
      });

      toast.success('Thank you! We\'ll be in touch soon.');
      setFormData({ name: '', email: '', school: '', role: '', message: '' });
    } catch (error) {
      console.error('Failed to submit form:', error);
      toast.error('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: Users,
      title: 'Reach Qualified Students',
      description: 'Connect with motivated students actively searching for colleges that match their profile.'
    },
    {
      icon: TrendingUp,
      title: 'Increase Enrollment',
      description: 'Improve yield rates by engaging with students earlier in their decision-making process.'
    },
    {
      icon: Building2,
      title: 'Enhance Your Profile',
      description: 'Showcase your programs, campus life, and unique offerings to thousands of prospective students.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Partner with Student Signal
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with qualified students, enhance your institution's visibility, and streamline your recruitment efforts.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <Icon className="text-green-700 mb-4" size={40} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How Student Signal Works for Institutions</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <CheckCircle className="text-green-700 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Lead Generation</h3>
                <p className="text-gray-600">Receive contact information from students who specifically request information about your institution.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="text-green-700 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Enhanced Listings</h3>
                <p className="text-gray-600">Maintain and update your college profile with current programs, admission requirements, and campus information.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="text-green-700 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Analytics & Insights</h3>
                <p className="text-gray-600">Access data on student interest, search patterns, and engagement with your institution's profile.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-xl p-8">
          <div className="text-center mb-8">
            <Mail className="text-green-700 mx-auto mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Started Today</h2>
            <p className="text-gray-600">
              Fill out the form below and our partnerships team will reach out to discuss how Student Signal can support your recruitment goals.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                placeholder="john.smith@university.edu"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Institution Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="school"
                value={formData.school}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                placeholder="State University"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Role <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
              >
                <option value="">Select your role</option>
                <option value="Admissions Director">Admissions Director</option>
                <option value="Marketing/Communications">Marketing/Communications</option>
                <option value="Enrollment Management">Enrollment Management</option>
                <option value="Counselor">High School Counselor</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                placeholder="Tell us about your recruitment goals and how we can help..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 disabled:bg-gray-400 transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit Inquiry'}
            </button>
          </form>
        </div>

        <p className="text-sm text-gray-500 text-center mt-8">
          For immediate assistance, email us at{' '}
          <a href="mailto:partnerships@studentsignal.com" className="text-green-700 font-semibold hover:underline">
            partnerships@studentsignal.com
          </a>
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default ForSchools;
