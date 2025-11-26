import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { adminContent } from '../../data/mockData';
import { Sparkles, ArrowRight } from 'lucide-react';

const DirectAdmissions = () => {
  return (
    <section className="py-24 bg-sand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left content */}
          <div className="w-full lg:w-1/2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-extrabold text-emerald">STUDENT</span>
              <span className="bg-emerald text-white text-xs px-2 py-1 rounded-lg font-bold tracking-wide">SIGNAL</span>
            </div>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-lavender/20 rounded-xl">
                <Sparkles className="text-lavender" size={28} />
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold">
                <span className="text-gradient bg-gradient-to-r from-lavender to-turquoise">
                  {adminContent.directAdmissions.title}
                </span>
              </h2>
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-5">
              {adminContent.directAdmissions.tagline}
            </h3>
            <p className="text-gray-600 mb-10 text-lg leading-relaxed">
              {adminContent.directAdmissions.description}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/signup">
                <Button className="bg-tangerine hover:bg-tangerine-dark text-white font-bold px-8 py-4 rounded-xl shadow-glow-tangerine hover:shadow-lg transition-all duration-300">
                  Create a Student Signal Profile
                </Button>
              </Link>
              <Link to="/direct-admissions">
                <Button variant="outline" className="border-2 border-emerald text-emerald hover:bg-emerald hover:text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 group">
                  Learn more
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right - Illustration */}
          <div className="w-full lg:w-1/2">
            <div className="relative bg-gradient-to-br from-turquoise/10 via-lavender/10 to-sand rounded-3xl p-8 lg:p-12">
              {/* Connection diagram illustration */}
              <div className="relative">
                {/* Student node */}
                <div className="absolute top-0 left-0 bg-white rounded-2xl p-4 shadow-lg border border-turquoise/30 hover:shadow-glow-turquoise transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald rounded-xl flex items-center justify-center text-white text-sm font-bold">
                      SS
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Student Signal Profile</span>
                  </div>
                </div>

                {/* Connection lines - SVG */}
                <svg className="w-full h-[250px]" viewBox="0 0 400 250">
                  {/* Curved lines with gradient */}
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FF7518" />
                      <stop offset="100%" stopColor="#9370DB" />
                    </linearGradient>
                  </defs>
                  <path d="M80 40 Q200 80 320 60" stroke="url(#lineGradient)" strokeWidth="3" fill="none" strokeDasharray="8,4" />
                  <path d="M80 40 Q200 120 320 140" stroke="url(#lineGradient)" strokeWidth="3" fill="none" strokeDasharray="8,4" />
                  <path d="M80 40 Q200 160 320 220" stroke="url(#lineGradient)" strokeWidth="3" fill="none" strokeDasharray="8,4" />
                  
                  {/* Animated dots on lines */}
                  <circle cx="150" cy="50" r="6" fill="#FF7518" className="animate-pulse" />
                  <circle cx="200" cy="90" r="6" fill="#00CED1" className="animate-pulse" />
                  <circle cx="250" cy="170" r="6" fill="#9370DB" className="animate-pulse" />
                </svg>

                {/* School cards */}
                <div className="absolute top-8 right-0 bg-white rounded-xl p-3 shadow-lg flex items-center gap-3 hover:shadow-glow-emerald transition-shadow">
                  <div className="w-8 h-8 bg-turquoise rounded-lg flex items-center justify-center text-white text-xs font-bold">U</div>
                  <span className="text-sm font-medium">Accepted at UCLA</span>
                  <span className="text-xs bg-emerald/10 text-emerald px-3 py-1 rounded-full font-semibold">Accepted</span>
                </div>

                <div className="absolute top-[45%] right-0 bg-white rounded-xl p-3 shadow-lg flex items-center gap-3 hover:shadow-glow-tangerine transition-shadow">
                  <div className="w-8 h-8 bg-tangerine rounded-lg flex items-center justify-center text-white text-xs font-bold">K</div>
                  <span className="text-sm font-medium">Kent State</span>
                  <span className="text-xs bg-turquoise/10 text-turquoise px-3 py-1 rounded-full font-semibold">Pending</span>
                </div>

                <div className="absolute bottom-8 right-0 bg-white rounded-xl p-3 shadow-lg flex items-center gap-3 hover:shadow-glow-lavender transition-shadow">
                  <div className="w-8 h-8 bg-lavender rounded-lg flex items-center justify-center text-white text-xs font-bold">A</div>
                  <span className="text-sm font-medium">Adelphi University</span>
                  <span className="text-xs bg-emerald/10 text-emerald px-3 py-1 rounded-full font-semibold">Accepted</span>
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
