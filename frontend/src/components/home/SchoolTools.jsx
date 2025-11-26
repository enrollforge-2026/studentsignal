import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { colleges } from '../../data/mockData';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

const SchoolTools = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left - School cards */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              {/* Saved schools mockup */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-sand">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-turquoise/10 rounded-xl">
                    <Sparkles className="text-turquoise" size={20} />
                  </div>
                  <span className="bg-emerald text-white text-xs px-3 py-1.5 rounded-lg font-bold">Saved</span>
                  <span className="text-sm text-gray-500 font-medium">Your saved schools</span>
                </div>

                <div className="space-y-4">
                  {colleges.slice(0, 3).map((college, index) => (
                    <div
                      key={college.id}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                        index === 0 
                          ? 'border-emerald bg-emerald/5 hover:shadow-glow-emerald' 
                          : index === 1 
                            ? 'border-turquoise/30 hover:border-turquoise hover:shadow-glow-turquoise'
                            : 'border-lavender/30 hover:border-lavender hover:shadow-glow-lavender'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={college.image}
                          alt={college.name}
                          className="w-14 h-14 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-bold text-gray-900">{college.shortName}</p>
                          <p className="text-sm text-gray-500">{college.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {college.directAdmission && (
                          <span className="text-xs bg-lavender/10 text-lavender px-3 py-1.5 rounded-full font-semibold">
                            Direct Admit
                          </span>
                        )}
                        <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                          index === 0 ? 'bg-emerald/10 text-emerald' : 'bg-turquoise/10 text-turquoise'
                        }`}>
                          {index === 0 ? 'Accepted' : 'Applied'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -bottom-8 -left-8 bg-gradient-to-r from-tangerine to-lavender rounded-2xl p-5 shadow-xl hover:shadow-glow-tangerine transition-shadow">
                <div className="flex items-center gap-3 text-white">
                  <CheckCircle size={24} />
                  <span className="font-bold">Track Progress</span>
                </div>
              </div>
              
              {/* Decorative dots */}
              <div className="absolute -top-4 right-8 w-4 h-4 bg-turquoise rounded-full shadow-glow-turquoise animate-pulse"></div>
              <div className="absolute top-1/2 -right-4 w-3 h-3 bg-lavender rounded-full shadow-glow-lavender animate-pulse delay-300"></div>
            </div>
          </div>

          {/* Right content */}
          <div className="w-full lg:w-1/2 lg:pl-8">
            <p className="text-sm font-bold tracking-widest text-turquoise mb-3 uppercase">
              STAY ON TRACK
            </p>
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-6">
              <span className="text-gradient bg-gradient-to-r from-tangerine via-lavender to-turquoise">
                Tools to organize your school search.
              </span>
            </h2>
            <p className="text-gray-600 mb-10 text-lg leading-relaxed">
              We'll help you build your list, track your progress, and get you recommendations all personalized to you.
            </p>
            
            <Link to="/colleges">
              <Button className="bg-emerald hover:bg-emerald-dark text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-glow-emerald transition-all duration-300 group">
                Start Exploring
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchoolTools;
