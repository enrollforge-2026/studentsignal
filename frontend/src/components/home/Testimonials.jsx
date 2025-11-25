import React, { useState } from 'react';
import { testimonials, adminContent } from '../../data/mockData';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-[#f5f0e8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left content */}
          <div className="w-full lg:w-1/2">
            <p className="text-sm font-semibold tracking-wider text-[#1a5d3a] mb-2">
              {adminContent.testimonialsSection.tagline}
            </p>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8">
              {adminContent.testimonialsSection.title}
            </h2>

            {/* Testimonial card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg relative">
              <Quote className="absolute top-6 left-6 text-[#f5a623] w-12 h-12 opacity-20" />
              
              <div className="relative z-10">
                <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                  "{testimonials[activeIndex].text}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{testimonials[activeIndex].author}</p>
                    <p className="text-sm text-gray-500">{testimonials[activeIndex].school}</p>
                  </div>
                </div>
              </div>

              {/* Quote mark */}
              <div className="absolute -bottom-4 right-8">
                <span className="text-6xl text-[#f5a623] font-serif">"</span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full border border-gray-300 hover:border-[#1a5d3a] hover:bg-[#1a5d3a] hover:text-white transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === activeIndex ? 'bg-[#1a5d3a] w-6' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full border border-gray-300 hover:border-[#1a5d3a] hover:bg-[#1a5d3a] hover:text-white transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Right - Image collage */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              {/* Main testimonial image */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={testimonials[activeIndex].image}
                  alt={testimonials[activeIndex].author}
                  className="w-full h-[400px] object-cover"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a5d3a]/30 to-transparent"></div>
                
                {/* Badge */}
                <div className="absolute bottom-4 right-4 bg-[#f5a623] text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Success Story
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#f5a623]/20 rounded-full -z-10"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#1a5d3a]/10 rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
