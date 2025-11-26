import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { heroImages, adminContent } from '../../data/mockData';

const HeroSection = () => {
  return (
    <section className="relative bg-emerald overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald via-emerald-dark to-emerald opacity-90"></div>
      
      {/* Decorative shapes */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-turquoise/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 left-10 w-48 h-48 bg-lavender/10 rounded-full blur-3xl"></div>
      
      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center min-h-[550px] py-16">
          {/* Left side - Images collage */}
          <div className="w-full lg:w-1/2 relative mb-8 lg:mb-0">
            <div className="relative w-full h-[400px] lg:h-[500px]">
              {/* Main large image */}
              <div className="absolute top-0 left-0 w-[65%] h-[70%] rounded-3xl overflow-hidden shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  src={heroImages[0]}
                  alt="Diverse students"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-dark/30 to-transparent"></div>
              </div>
              
              {/* Top right circular image */}
              <div className="absolute top-4 right-4 w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-sand shadow-lg hover:scale-110 transition-transform duration-300">
                <img
                  src={heroImages[1]}
                  alt="Campus life"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Bottom right image */}
              <div className="absolute bottom-0 right-0 w-[45%] h-[50%] rounded-3xl overflow-hidden shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  src={heroImages[2]}
                  alt="Students studying"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-lavender/20 to-transparent"></div>
              </div>
              
              {/* Bottom left circular */}
              <div className="absolute bottom-8 left-[30%] w-20 h-20 lg:w-28 lg:h-28 rounded-full overflow-hidden border-4 border-tangerine shadow-glow-tangerine hover:scale-110 transition-transform duration-300">
                <img
                  src={heroImages[3]}
                  alt="Graduation"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative elements */}
              <div className="absolute top-[20%] right-[25%] w-5 h-5 bg-tangerine rounded-full animate-pulse shadow-glow-tangerine"></div>
              <div className="absolute bottom-[30%] left-[50%] w-4 h-4 bg-turquoise rounded-full animate-pulse shadow-glow-turquoise delay-300"></div>
              <div className="absolute top-[60%] right-[40%] w-3 h-3 bg-lavender rounded-full animate-pulse shadow-glow-lavender delay-500"></div>
            </div>
          </div>

          {/* Right side - Text content */}
          <div className="w-full lg:w-1/2 lg:pl-12 text-white">
            <p className="text-sm font-bold tracking-widest text-turquoise mb-3 uppercase">
              {adminContent.heroSection.title}
            </p>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-6 leading-tight">
              <span className="text-white">{adminContent.heroSection.subtitle.split(' ').slice(0, 2).join(' ')}</span>
              <br />
              <span className="text-gradient bg-gradient-to-r from-tangerine via-tangerine-light to-lavender">
                {adminContent.heroSection.subtitle.split(' ').slice(2).join(' ')}
              </span>
            </h1>
            <p className="text-lg text-sand/90 mb-10 max-w-lg leading-relaxed">
              {adminContent.heroSection.description}
            </p>

            <div className="mb-6">
              <p className="text-sm font-bold tracking-widest text-sand/70 mb-5 uppercase">
                START YOUR SEARCH
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/k12">
                  <Button 
                    variant="outline" 
                    className="bg-transparent border-2 border-sand/50 text-sand hover:bg-sand hover:text-emerald font-bold px-7 py-6 rounded-xl transition-all duration-300 hover:shadow-lg"
                  >
                    K-12 Schools
                  </Button>
                </Link>
                <Link to="/colleges">
                  <Button 
                    className="bg-tangerine hover:bg-tangerine-dark text-white font-bold px-7 py-6 border-0 rounded-xl shadow-glow-tangerine hover:shadow-lg transition-all duration-300 animate-pulse-glow"
                  >
                    Colleges
                  </Button>
                </Link>
                <Link to="/graduate">
                  <Button 
                    variant="outline" 
                    className="bg-transparent border-2 border-sand/50 text-sand hover:bg-sand hover:text-emerald font-bold px-7 py-6 rounded-xl transition-all duration-300 hover:shadow-lg"
                  >
                    Grad Schools
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#faf3ec"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
