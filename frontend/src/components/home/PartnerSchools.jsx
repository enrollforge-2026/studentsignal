import React from 'react';
import { Link } from 'react-router-dom';
import { partnerSchools } from '../../data/mockData';
import { Button } from '../ui/button';

const PartnerSchools = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left content */}
          <div className="w-full lg:w-1/2">
            <p className="text-sm font-semibold tracking-wider text-[#1a5d3a] mb-2">
              PARTNER WITH STUDENT SIGNAL
            </p>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              For schools and colleges
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Are you a college or K-12 school representative? Learn more about how you can connect with students and families throughout the school search process.
            </p>
            
            <div className="flex flex-col gap-3">
              <Link to="/for-schools/claim" className="text-[#1a5d3a] font-semibold hover:underline">
                Claim Your School
              </Link>
              <Link to="/for-schools">
                <Button className="bg-[#1a5d3a] hover:bg-[#15472d] text-white font-semibold">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Right - Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800"
                alt="Students on campus"
                className="rounded-2xl shadow-xl w-full h-[350px] object-cover"
              />
              
              {/* Badge */}
              <div className="absolute -bottom-4 -right-4 bg-[#f5a623] rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-2xl">2,700+</span>
                  <span className="text-white text-sm">Partner<br/>Schools</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partner logos */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500 mb-8">
            Over 2,700 schools partner with Student Signal
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            {partnerSchools.map((school) => (
              <div key={school.id} className="flex items-center gap-2 text-gray-600 hover:text-[#1a5d3a] transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-lg">
                  {school.logo}
                </div>
                <span className="font-medium text-sm hidden md:block">{school.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerSchools;
