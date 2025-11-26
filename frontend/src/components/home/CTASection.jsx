import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#e8f4ec]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-[#fff8e7] rounded-3xl p-12 text-center overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#1a5d3a]/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#f5a623]/10 rounded-full translate-x-1/4 translate-y-1/4"></div>
          
          {/* Character illustration */}
          <div className="relative w-40 h-40 mx-auto mb-8">
            <div className="w-full h-full bg-gradient-to-br from-[#1a5d3a] to-[#2d7a4f] rounded-full flex items-center justify-center">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                <span className="text-6xl">🎓</span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            Not sure where to start?
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Tell us what matters most to you and we'll create a custom list of schools tailored to fit your needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quiz">
              <Button className="bg-[#f5a623] hover:bg-[#e09000] text-white font-semibold px-8 py-3">
                Take our College Quiz
              </Button>
            </Link>
            <Link to="/k12">
              <Button variant="outline" className="border-[#f5a623] text-[#f5a623] hover:bg-[#f5a623] hover:text-white font-semibold px-8 py-3">
                Find a K-12 School Near You
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
