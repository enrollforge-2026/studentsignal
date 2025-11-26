import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { GraduationCap, Sparkles } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-sand-light to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-sand via-sand-light to-white rounded-[2.5rem] p-12 lg:p-16 text-center overflow-hidden shadow-xl">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-turquoise/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-56 h-56 bg-lavender/10 rounded-full translate-x-1/4 translate-y-1/4 blur-2xl"></div>
          <div className="absolute top-1/2 left-10 w-4 h-4 bg-tangerine rounded-full shadow-glow-tangerine animate-float"></div>
          <div className="absolute bottom-20 right-20 w-3 h-3 bg-turquoise rounded-full shadow-glow-turquoise animate-float delay-500"></div>
          
          {/* Character illustration */}
          <div className="relative w-44 h-44 mx-auto mb-10">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald via-turquoise to-lavender rounded-full animate-pulse opacity-20"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-emerald to-turquoise rounded-full flex items-center justify-center">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                <GraduationCap className="w-16 h-16 text-emerald" />
              </div>
            </div>
            {/* Sparkles around */}
            <Sparkles className="absolute -top-2 right-4 w-6 h-6 text-tangerine animate-pulse" />
            <Sparkles className="absolute bottom-4 -left-2 w-5 h-5 text-lavender animate-pulse delay-300" />
          </div>

          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-5">
            Not sure where to start?
          </h2>
          <p className="text-gray-600 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
            Tell us what matters most to you and we'll create a custom list of schools tailored to fit your needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quiz">
              <Button className="bg-gradient-to-r from-tangerine to-lavender hover:from-tangerine-dark hover:to-lavender-dark text-white font-bold px-10 py-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg">
                Take our College Quiz
              </Button>
            </Link>
            <Link to="/k12">
              <Button variant="outline" className="border-2 border-turquoise text-turquoise hover:bg-turquoise hover:text-white font-bold px-10 py-5 rounded-xl transition-all duration-300 text-lg">
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
