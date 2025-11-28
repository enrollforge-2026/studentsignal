import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/top/TopExperienceLayer';
import Footer from '../components/layout/Footer';
import { GraduationCap, Search, Bookmark, MessageCircle, TrendingUp, Award } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: 'Discover Colleges',
      description: 'Browse thousands of colleges and filter by location, major, tuition, and more to find your perfect fit.'
    },
    {
      icon: Bookmark,
      title: 'Save Favorites',
      description: 'Create your personalized list of colleges and scholarships to track opportunities that match your goals.'
    },
    {
      icon: MessageCircle,
      title: 'Get AI Guidance',
      description: 'Chat with Elon, our AI assistant, to get instant answers about colleges, scholarships, and the application process.'
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Use your Signal Hub dashboard to organize your college search, track deadlines, and manage applications.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopExperienceLayer />
      
      <main className="max-w-5xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How Student Signal Works
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your free, comprehensive platform for finding the perfect college and scholarships that match your unique goals and qualifications.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Icon className="text-green-700" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Who It's For */}
        <div className="bg-white rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Who Is Student Signal For?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <GraduationCap className="text-green-700 mb-3" size={32} />
              <h3 className="font-bold text-gray-900 mb-2">High School Students</h3>
              <p className="text-gray-600 text-sm">Explore colleges, find scholarships, and plan your path to higher education with free tools and guidance.</p>
            </div>
            <div>
              <Award className="text-green-700 mb-3" size={32} />
              <h3 className="font-bold text-gray-900 mb-2">Transfer Students</h3>
              <p className="text-gray-600 text-sm">Find four-year institutions that align with your community college credits and career goals.</p>
            </div>
            <div>
              <MessageCircle className="text-green-700 mb-3" size={32} />
              <h3 className="font-bold text-gray-900 mb-2">Parents & Counselors</h3>
              <p className="text-gray-600 text-sm">Support students in their college search with comprehensive information and planning resources.</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-gradient-to-br from-green-700 to-green-800 rounded-xl p-8 text-white mb-16">
          <h2 className="text-2xl font-bold mb-6">What Makes Student Signal Different?</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-green-300 text-xl">✓</span>
              <span><strong>100% Free:</strong> No hidden fees, premium tiers, or paywalls. All features are free forever.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-300 text-xl">✓</span>
              <span><strong>AI-Powered Help:</strong> Get instant answers from Elon, our intelligent chatbot trained on college admissions.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-300 text-xl">✓</span>
              <span><strong>Personalized Dashboard:</strong> Track your college list, saved scholarships, and application deadlines in one place.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-300 text-xl">✓</span>
              <span><strong>Comprehensive Data:</strong> Access information on thousands of colleges and hundreds of scholarships.</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h2>
          <p className="text-gray-600 mb-6">Join thousands of students finding their perfect college match.</p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition-colors"
            >
              Sign Up Free
            </Link>
            <Link
              to="/colleges"
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Browse Colleges
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;
