import React, { useState } from 'react';
import TopExperienceLayer from '../../components/top/TopExperienceLayer';
import Footer from '../../components/layout/Footer';
import { Globe } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../services/api';

const InternationalStudents = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/leads', { email, first_name: '', last_name: '', college_id: 'international-students-interest' });
      toast.success('Thank you! We\'ll notify you when this feature launches.');
      setEmail('');
    } catch (error) {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopExperienceLayer />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Globe className="mx-auto mb-4 text-[#1a5d3a]" size={64} />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">International Students</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Navigate the U.S. college application process with confidence. Find schools that welcome international students, understand visa requirements, and discover scholarship opportunities.
          </p>
        </div>
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
          <p className="text-gray-600 mb-6">Be the first to know when we launch our international student resources. Enter your email below.</p>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your.email@example.com" className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1a5d3a] focus:ring-4 focus:ring-[#1a5d3a]/10 transition-all outline-none" />
            <button type="submit" disabled={submitting} className="bg-[#1a5d3a] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#155230] transition-colors disabled:opacity-50">{submitting ? 'Submitting...' : 'Notify Me'}</button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InternationalStudents;