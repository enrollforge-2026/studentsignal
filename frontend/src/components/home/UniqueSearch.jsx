import React from 'react';
import { adminContent } from '../../data/mockData';
import { BarChart3, Star, Heart } from 'lucide-react';

const FeatureIcon = ({ type }) => {
  const icons = {
    chart: <BarChart3 className="w-8 h-8 text-[#f5a623]" />,
    star: <Star className="w-8 h-8 text-[#f5a623]" />,
    heart: <Heart className="w-8 h-8 text-[#f5a623]" />
  };
  return icons[type] || icons.chart;
};

const UniqueSearch = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#f5f0e8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold tracking-wider text-[#1a5d3a] mb-2">
            {adminContent.searchSection.tagline}
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#f5a623] mb-2">
            {adminContent.searchSection.title}
          </h2>
          <h3 className="text-3xl lg:text-4xl font-bold text-[#f5a623] mb-6">
            {adminContent.searchSection.subtitle}
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {adminContent.searchSection.description}
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {adminContent.features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="mb-4 flex justify-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <FeatureIcon type={feature.icon} />
                </div>
              </div>
              <h4 className="text-sm font-bold text-[#1a5d3a] tracking-wider mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Decorative illustration */}
        <div className="flex justify-center mt-12">
          <div className="relative">
            <div className="w-32 h-32 bg-[#f5a623]/20 rounded-full flex items-center justify-center">
              <div className="w-24 h-24 bg-[#f5a623]/40 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-[#f5a623] rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UniqueSearch;
