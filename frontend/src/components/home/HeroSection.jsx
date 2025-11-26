import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { heroImages, adminContent } from '../../data/mockData';

const HeroSection = () => {
  return (
    <section className="relative bg-[#1a5d3a] overflow-hidden">
      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center min-h-[500px] py-12">
          {/* Left side - Images collage */}
          <div className="w-full lg:w-1/2 relative mb-8 lg:mb-0">
            <div className="relative w-full h-[400px] lg:h-[500px]">
              {/* Main large image */}
              <div className="absolute top-0 left-0 w-[65%] h-[70%] rounded-2xl overflow-hidden shadow-2xl transform -rotate-3">
                <img
                  src={heroImages[0]}
                  alt="Diverse students"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Top right circular image */}
              <div className="absolute top-4 right-4 w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={heroImages[1]}
                  alt="Campus life"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Bottom right image */}
              <div className="absolute bottom-0 right-0 w-[45%] h-[50%] rounded-2xl overflow-hidden shadow-xl transform rotate-3">
                <img
                  src={heroImages[2]}
                  alt="Students studying"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Bottom left circular */}
              <div className="absolute bottom-8 left-[30%] w-20 h-20 lg:w-28 lg:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={heroImages[3]}
                  alt="Graduation"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative elements */}
              <div className="absolute top-[20%] right-[25%] w-4 h-4 bg-[#f5a623] rounded-full animate-pulse"></div>
              <div className="absolute bottom-[30%] left-[50%] w-3 h-3 bg-orange-400 rounded-full animate-pulse delay-300"></div>
            </div>
          </div>

          {/* Right side - Text content */}
          <div className="w-full lg:w-1/2 lg:pl-12 text-white">
            <p className="text-sm font-semibold tracking-wider text-white/80 mb-2">
              {adminContent.heroSection.title}
            </p>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
              {adminContent.heroSection.subtitle}
            </h1>
            <p className="text-lg text-white/90 mb-8 max-w-lg">
              {adminContent.heroSection.description}
            </p>

            <div className="mb-6">
              <p className="text-sm font-semibold tracking-wider text-white/80 mb-4">
                START YOUR SEARCH
              </p>
              <div className="flex flex-wrap gap-3">
                {adminContent.heroSection.ctaButtons.map((button, index) => (
                  <Link key={index} to={button.href}>
                    <Button 
                      variant={button.variant === 'primary' ? 'default' : 'outline'}
                      className={button.variant === 'primary' 
                        ? 'bg-[#f5a623] hover:bg-[#e09000] text-white font-semibold px-6 border-0'
                        : 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#1a5d3a] font-semibold px-6 transition-all'
                      }
                    >
                      {button.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
