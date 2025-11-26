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
    <section className="py-24 bg-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left content */}
          <div className="w-full lg:w-1/2">
            <p className="text-sm font-bold tracking-widest text-emerald mb-3 uppercase">
              {adminContent.testimonialsSection.tagline}
            </p>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-10">
              {adminContent.testimonialsSection.title}
            </h2>

            {/* Testimonial card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
              {/* Gradient accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-tangerine via-lavender to-turquoise"></div>
              
              <Quote className="absolute top-8 left-8 text-lavender/20 w-16 h-16" />
              
              <div className="relative z-10 pt-8">
                <p className="text-gray-700 text-lg leading-relaxed mb-8 italic">
                  "{testimonials[activeIndex].text}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{testimonials[activeIndex].author}</p>
                    <p className="text-emerald font-medium">{testimonials[activeIndex].school}</p>
                  </div>
                </div>
              </div>

              {/* Quote mark */}
              <div className="absolute -bottom-6 right-8">
                <span className="text-8xl text-gradient bg-gradient-to-r from-tangerine to-lavender font-serif">"</span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="p-3 rounded-xl border-2 border-gray-200 hover:border-emerald hover:bg-emerald hover:text-white transition-all duration-300"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex 
                        ? 'bg-gradient-to-r from-tangerine to-lavender w-8' 
                        : 'bg-gray-300 w-2 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="p-3 rounded-xl border-2 border-gray-200 hover:border-emerald hover:bg-emerald hover:text-white transition-all duration-300"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Right - Image collage */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              {/* Main testimonial image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                <img
                  src={testimonials[activeIndex].image}
                  alt={testimonials[activeIndex].author}
                  className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald/40 via-transparent to-lavender/20"></div>
                
                {/* Badge */}
                <div className="absolute bottom-6 right-6 bg-gradient-to-r from-tangerine to-lavender text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg">
                  Success Story
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-turquoise/20 rounded-full -z-10 blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-lavender/20 rounded-full -z-10 blur-xl"></div>
              
              {/* Floating elements */}
              <div className="absolute top-8 -left-4 w-4 h-4 bg-tangerine rounded-full shadow-glow-tangerine animate-float"></div>
              <div className="absolute bottom-16 -right-4 w-3 h-3 bg-turquoise rounded-full shadow-glow-turquoise animate-float delay-300"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
