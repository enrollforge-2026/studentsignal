import React from 'react';
import { adminContent } from '../../data/mockData';
import { BarChart3, Star, Heart } from 'lucide-react';

const FeatureIcon = ({ type }) => {
  const icons = {
    chart: <BarChart3 className="w-10 h-10 text-tangerine" />,
    star: <Star className="w-10 h-10 text-turquoise" />,
    heart: <Heart className="w-10 h-10 text-lavender" />
  };
  return icons[type] || icons.chart;
};

const UniqueSearch = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-sand-light to-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-sm font-bold tracking-widest text-emerald mb-3 uppercase">
            {adminContent.searchSection.tagline}
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-3">
            <span className="text-gradient bg-gradient-to-r from-tangerine via-lavender to-turquoise">
              {adminContent.searchSection.title}
            </span>
          </h2>
          <h3 className="text-4xl lg:text-5xl font-extrabold mb-8">
            <span className="text-gradient bg-gradient-to-r from-lavender via-turquoise to-emerald">
              {adminContent.searchSection.subtitle}
            </span>
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            {adminContent.searchSection.description}
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {adminContent.features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="mb-6 flex justify-center">
                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 ${
                  index === 0 ? 'bg-tangerine/10 group-hover:shadow-glow-tangerine' :
                  index === 1 ? 'bg-turquoise/10 group-hover:shadow-glow-turquoise' :
                  'bg-lavender/10 group-hover:shadow-glow-lavender'
                }`}>
                  <FeatureIcon type={feature.icon} />
                </div>
              </div>
              <h4 className={`text-sm font-bold tracking-widest mb-3 ${
                index === 0 ? 'text-tangerine' :
                index === 1 ? 'text-turquoise' :
                'text-lavender'
              }`}>
                {feature.title}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Decorative illustration */}
        <div className="flex justify-center mt-16">
          <div className="relative">
            <div className="w-36 h-36 bg-gradient-to-br from-tangerine/20 via-lavender/20 to-turquoise/20 rounded-full flex items-center justify-center animate-float">
              <div className="w-28 h-28 bg-gradient-to-br from-tangerine/30 via-lavender/30 to-turquoise/30 rounded-full flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-tangerine via-lavender to-turquoise rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-3xl font-bold">!</span>
                </div>
              </div>
            </div>
            {/* Orbiting dots */}
            <div className="absolute top-0 left-1/2 w-4 h-4 bg-tangerine rounded-full shadow-glow-tangerine animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-turquoise rounded-full shadow-glow-turquoise animate-pulse delay-300"></div>
            <div className="absolute top-1/2 left-0 w-3 h-3 bg-lavender rounded-full shadow-glow-lavender animate-pulse delay-500"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UniqueSearch;
