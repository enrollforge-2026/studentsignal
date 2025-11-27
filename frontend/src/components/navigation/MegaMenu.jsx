import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';
import api from '../../services/api';

const MegaMenu = ({ label, menuKey, children, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feature, setFeature] = useState(null);

  useEffect(() => {
    if (menuKey) {
      fetchFeature();
    }
  }, [menuKey]);

  const fetchFeature = async () => {
    try {
      const response = await api.get(`/api/mega-menu/features/${menuKey}`);
      setFeature(response.data.feature);
    } catch (error) {
      console.error('Failed to load feature:', error);
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className={`flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[#1a5d3a] transition-colors ${className}`}>
        {label}
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-screen max-w-4xl z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-100">
            <div className={`grid ${feature ? 'grid-cols-3' : 'grid-cols-1'} gap-8`}>
              <div className={feature ? 'col-span-2' : 'col-span-1'}>
                {children}
              </div>

              {feature && (
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border-2 border-gray-100 hover:border-[#1a5d3a]/20 transition-all">
                  {feature.image_url && (
                    <div className="relative mb-3">
                      <img
                        src={feature.image_url}
                        alt={feature.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <span className="absolute top-2 right-2 px-2 py-1 bg-[#1a5d3a] text-white text-xs font-bold rounded shadow-md">
                        {feature.label}
                      </span>
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <Link
                    to={feature.cta_url}
                    className="inline-flex items-center gap-2 text-[#1a5d3a] font-semibold text-sm hover:gap-3 transition-all"
                  >
                    {feature.cta_text}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const MegaMenuSection = ({ title, links }) => (
  <div>
    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{title}</h3>
    <div className="space-y-2">
      {links.map((link, index) => (
        <Link
          key={index}
          to={link.href}
          className="block text-sm font-medium text-gray-700 hover:text-[#1a5d3a] transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </div>
  </div>
);

export default MegaMenu;
