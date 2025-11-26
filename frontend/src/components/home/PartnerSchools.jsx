import React from 'react';
import { Link } from 'react-router-dom';
import { partnerSchools } from '../../data/mockData';
import { Button } from '../ui/button';

const PartnerSchools = () => {
  return (
    <section className="py-24 bg-sand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left content */}
          <div className="w-full lg:w-1/2">
            <p className="text-sm font-bold tracking-widest text-lavender mb-3 uppercase">
              PARTNER WITH STUDENT SIGNAL
            </p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6">
              For schools and colleges
            </h2>
            <p className="text-gray-600 mb-10 leading-relaxed text-lg">
              Are you a college or K-12 school representative? Learn more about how you can connect with students and families throughout the school search process.
            </p>
            
            <div className="flex flex-col gap-4">
              <Link to="/for-schools/claim" className="text-emerald font-bold hover:underline inline-flex items-center gap-2">
                Claim Your School
                <span className="text-turquoise">→</span>
              </Link>
              <Link to="/for-schools">
                <Button className="bg-emerald hover:bg-emerald-dark text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-glow-emerald transition-all duration-300">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Right - Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative group">
              <img
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800"
                alt="Students on campus"
                className="rounded-3xl shadow-2xl w-full h-[400px] object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-emerald/20 to-transparent"></div>
              
              {/* Badge */}
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-tangerine to-lavender rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3">
                  <span className="text-white font-extrabold text-3xl">2,700+</span>
                  <span className="text-white/90 text-sm font-medium">Partner<br/>Schools</span>
                </div>
              </div>
              
              {/* Decorative */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-turquoise rounded-full shadow-glow-turquoise animate-float"></div>
              <div className="absolute top-1/3 -right-4 w-6 h-6 bg-lavender rounded-full shadow-glow-lavender animate-float delay-300"></div>
            </div>
          </div>
        </div>

        {/* Partner logos */}
        <div className="mt-20 pt-10 border-t border-sand-dark">
          <p className="text-center text-sm text-gray-500 mb-10 font-medium">
            Over 2,700 schools partner with Student Signal
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-20">
            {partnerSchools.map((school, index) => (
              <div key={school.id} className={`flex items-center gap-3 transition-all duration-300 hover:scale-110 cursor-pointer ${
                index === 0 ? 'text-emerald hover:text-emerald-dark' :
                index === 1 ? 'text-tangerine hover:text-tangerine-dark' :
                index === 2 ? 'text-turquoise hover:text-turquoise-dark' :
                'text-lavender hover:text-lavender-dark'
              }`}>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-extrabold text-xl text-white ${
                  index === 0 ? 'bg-emerald' :
                  index === 1 ? 'bg-tangerine' :
                  index === 2 ? 'bg-turquoise' :
                  'bg-lavender'
                }`}>
                  {school.logo}
                </div>
                <span className="font-semibold text-gray-700 hidden md:block">{school.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerSchools;
