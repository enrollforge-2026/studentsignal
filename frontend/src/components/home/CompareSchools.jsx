import React from 'react';
import { Link } from 'react-router-dom';
import { colleges } from '../../data/mockData';
import { ArrowRight } from 'lucide-react';

const CompareSchools = () => {
  const compareColleges = colleges.slice(0, 2);

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Green wave background */}
      <div className="absolute inset-0">
        <svg className="absolute top-0 w-full" viewBox="0 0 1440 200" fill="none" preserveAspectRatio="none">
          <path
            d="M0 100C240 20 480 20 720 60C960 100 1200 180 1440 140V200H0V100Z"
            fill="#1a5d3a"
          />
        </svg>
        <div className="absolute top-[100px] left-0 right-0 bottom-0 bg-[#1a5d3a]"></div>
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 200" fill="none" preserveAspectRatio="none">
          <path
            d="M0 50C240 130 480 130 720 90C960 50 1200 -30 1440 10V200H0V50Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left content */}
          <div className="w-full lg:w-1/3 text-white">
            <p className="text-sm font-semibold tracking-wider text-white/80 mb-2">
              CHOOSE YOUR SCHOOL
            </p>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#f5a623] mb-4">
              Everything you need to make your decision.
            </h2>
            <p className="text-white/90 mb-6 leading-relaxed">
              With the information you care about on every school, you'll be able to research and compare schools and colleges to make your decision.
            </p>
            
            <div className="flex flex-col gap-2">
              <Link to="/k12" className="text-[#f5a623] font-semibold hover:underline flex items-center gap-1">
                Compare K-12 Schools <ArrowRight size={16} />
              </Link>
              <Link to="/colleges" className="text-[#f5a623] font-semibold hover:underline flex items-center gap-1">
                Compare Colleges <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Right - Comparison cards */}
          <div className="w-full lg:w-2/3">
            <div className="flex flex-col md:flex-row items-start gap-6 justify-center">
              {/* Comparison badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:block">
                <div className="bg-[#f5a623] text-white font-bold text-sm px-4 py-2 rounded-full shadow-lg">
                  2023 Best
                </div>
              </div>

              {compareColleges.map((college, index) => (
                <div
                  key={college.id}
                  className={`bg-white rounded-2xl overflow-hidden shadow-xl w-full md:w-[280px] transform ${
                    index === 0 ? 'md:-rotate-2 md:-translate-y-4' : 'md:rotate-2 md:translate-y-4'
                  }`}
                >
                  <div className="relative h-40">
                    <img
                      src={college.image}
                      alt={college.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-[#f5a623] text-white text-xs font-bold px-2 py-1 rounded">
                      #{college.ranking}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1">{college.shortName}</h3>
                    <p className="text-sm text-gray-500 mb-4">{college.location}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Acceptance Rate</span>
                        <span className="font-semibold text-[#1a5d3a]">{college.acceptanceRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Net Price</span>
                        <span className="font-semibold text-[#f5a623]">${college.tuitionInState.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">SAT Range</span>
                        <span className="font-semibold">{college.satRange}</span>
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
