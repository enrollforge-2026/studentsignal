import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { adminContent } from '../../data/mockData';
import { Sparkles, ArrowRight } from 'lucide-react';

const DirectAdmissions = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left content */}
          <div className="w-full lg:w-1/2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-[#1a5d3a]">STUDENT</span>
              <span className="bg-[#1a5d3a] text-white text-xs px-1.5 py-0.5 rounded font-semibold">SIGNAL</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-[#f5a623]" size={24} />
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1a5d3a] italic">
                {adminContent.directAdmissions.title}
              </h2>
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
              {adminContent.directAdmissions.tagline}
            </h3>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              {adminContent.directAdmissions.description}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/signup">
                <Button className="bg-[#f5a623] hover:bg-[#e09000] text-white font-semibold px-6 py-3">
                  Create a Student Signal Profile
                </Button>
              </Link>
              <Link to="/direct-admissions">
                <Button variant="outline" className="border-[#1a5d3a] text-[#1a5d3a] hover:bg-[#1a5d3a] hover:text-white font-semibold px-6 py-3">
                  Learn more
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right - Illustration */}
          <div className="w-full lg:w-1/2">
            <div className="relative bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] rounded-3xl p-8 lg:p-12">
              {/* Connection diagram illustration */}
              <div className="relative">
                {/* Student node */}
                <div className="absolute top-0 left-0 bg-white rounded-xl p-3 shadow-lg border border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#1a5d3a] rounded-full flex items-center justify-center text-white text-xs font-bold">
                      SS
                    </div>
                    <span className="text-xs font-medium text-gray-700">Student Signal Profile</span>
                  </div>
                </div>

                {/* Connection lines - SVG */}
                <svg className="w-full h-[250px]" viewBox="0 0 400 250">
                  {/* Curved lines */}
                  <path d="M80 40 Q200 80 320 60" stroke="#f5a623" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                  <path d="M80 40 Q200 120 320 140" stroke="#f5a623" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                  <path d="M80 40 Q200 160 320 220" stroke="#f5a623" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                  
                  {/* Dots on lines */}
                  <circle cx="150" cy="50" r="4" fill="#f5a623" className="animate-pulse" />
                  <circle cx="200" cy="90" r="4" fill="#f5a623" className="animate-pulse" />
                  <circle cx="250" cy="170" r="4" fill="#f5a623" className="animate-pulse" />
                </svg>

                {/* School cards */}
                <div className="absolute top-8 right-0 bg-white rounded-lg p-2 shadow-md flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs">U</div>
                  <span className="text-xs font-medium">Accepted at UCLA</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Accepted</span>
                </div>

                <div className="absolute top-[45%] right-0 bg-white rounded-lg p-2 shadow-md flex items-center gap-2">
                  <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center text-white text-xs">K</div>
                  <span className="text-xs font-medium">Kent State</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Pending</span>
                </div>

                <div className="absolute bottom-8 right-0 bg-white rounded-lg p-2 shadow-md flex items-center gap-2">
                  <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center text-white text-xs">A</div>
                  <span className="text-xs font-medium">Adelphi University</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Accepted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DirectAdmissions;
