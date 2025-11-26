import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { colleges } from '../../data/mockData';
import { ArrowRight, CheckCircle } from 'lucide-react';

const SchoolTools = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left - School cards */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              {/* Saved schools mockup */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-[#1a5d3a] text-white text-xs px-2 py-1 rounded font-semibold">Saved</span>
                  <span className="text-sm text-gray-500">Your saved schools</span>
                </div>

                <div className="space-y-3">
                  {colleges.slice(0, 3).map((college, index) => (
                    <div
                      key={college.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        index === 0 ? 'border-[#1a5d3a] bg-[#1a5d3a]/5' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={college.image}
                          alt={college.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-sm text-gray-900">{college.shortName}</p>
                          <p className="text-xs text-gray-500">{college.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {college.directAdmission && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Direct Admit
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          index === 0 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {index === 0 ? 'Accepted' : 'Applied'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -bottom-6 -left-6 bg-[#f5a623] rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle size={20} />
                  <span className="font-semibold text-sm">Track Progress</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className="w-full lg:w-1/2 lg:pl-8">
            <p className="text-sm font-semibold tracking-wider text-[#1a5d3a] mb-2">
              STAY ON TRACK
            </p>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#f5a623] mb-4">
              Tools to organize your school search.
            </h2>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              We'll help you build your list, track your progress, and get you recommendations all personalized to you.
            </p>
            
            <Link to="/colleges">
              <Button className="bg-[#1a5d3a] hover:bg-[#15472d] text-white font-semibold group">
                Start Exploring
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchoolTools;
