import React from 'react';
import { Link } from 'react-router-dom';
import { colleges } from '../../data/mockData';
import { ArrowRight } from 'lucide-react';

const CompareSchools = () => {
  const compareColleges = colleges.slice(0, 2);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Green wave background */}
      <div className="absolute inset-0">
        <svg className="absolute top-0 w-full" viewBox="0 0 1440 200" fill="none" preserveAspectRatio="none">
          <path
            d="M0 100C240 20 480 20 720 60C960 100 1200 180 1440 140V200H0V100Z"
            fill="#228B22"
          />
        </svg>
        <div className="absolute top-[100px] left-0 right-0 bottom-0 bg-emerald"></div>
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 200" fill="none" preserveAspectRatio="none">
          <path
            d="M0 50C240 130 480 130 720 90C960 50 1200 -30 1440 10V200H0V50Z"
            fill="#faf3ec"
          />
        </svg>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-40 left-20 w-32 h-32 bg-turquoise/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-40 right-20 w-48 h-48 bg-lavender/10 rounded-full blur-2xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left content */}
          <div className="w-full lg:w-1/3 text-white">
            <p className="text-sm font-bold tracking-widest text-turquoise mb-3 uppercase">
              CHOOSE YOUR SCHOOL
            </p>
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-6">
              <span className="text-gradient bg-gradient-to-r from-tangerine via-sand to-lavender">
                Everything you need to make your decision.
              </span>
            </h2>
            <p className="text-sand/90 mb-10 leading-relaxed text-lg">
              With the information you care about on every school, you'll be able to research and compare schools and colleges to make your decision.
            </p>
            
            <div className="flex flex-col gap-3">
              <Link to="/k12" className="text-tangerine font-bold hover:underline flex items-center gap-2 group">
                Compare K-12 Schools 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/colleges" className="text-tangerine font-bold hover:underline flex items-center gap-2 group">
                Compare Colleges 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right - Comparison cards */}
          <div className="w-full lg:w-2/3">
            <div className="flex flex-col md:flex-row items-start gap-8 justify-center relative">
              {/* Comparison badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:block">
                <div className="bg-gradient-to-r from-tangerine to-lavender text-white font-bold text-sm px-6 py-3 rounded-full shadow-xl animate-pulse">
                  2025 Best
                </div>
              </div>

              {compareColleges.map((college, index) => (
                <div
                  key={college.id}
                  className={`bg-white rounded-3xl overflow-hidden shadow-2xl w-full md:w-[300px] transform transition-all duration-500 hover:scale-105 ${
                    index === 0 ? 'md:-rotate-3 md:-translate-y-4 hover:shadow-glow-turquoise' : 'md:rotate-3 md:translate-y-4 hover:shadow-glow-lavender'
                  }`}
                >
                  <div className="relative h-44">
                    <img
                      src={college.image}
                      alt={college.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    <div className={`absolute top-3 right-3 text-white text-xs font-bold px-3 py-1.5 rounded-lg ${
                      index === 0 ? 'bg-turquoise' : 'bg-lavender'
                    }`}>
                      #{college.ranking}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-extrabold text-gray-900 mb-1 text-lg">{college.shortName}</h3>
                    <p className="text-sm text-gray-500 mb-5">{college.location}</p>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Acceptance Rate</span>
                        <span className="font-bold text-emerald">{college.acceptanceRate}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Net Price</span>
                        <span className="font-bold text-tangerine">${college.tuitionInState.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">SAT Range</span>
                        <span className="font-bold text-lavender">{college.satRange}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompareSchools;
