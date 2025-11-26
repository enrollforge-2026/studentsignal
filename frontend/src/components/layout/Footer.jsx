import React from 'react';
import { Link } from 'react-router-dom';
import { footerLinks } from '../../data/mockData';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#f5f0e8] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo and tagline */}
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <span className="text-xl font-bold text-[#1a5d3a]">STUDENT</span>
            <span className="bg-[#1a5d3a] text-white text-xs px-1.5 py-0.5 rounded font-semibold ml-1">SIGNAL</span>
          </div>
          <p className="text-gray-600 text-sm max-w-md">
            Discover the colleges and scholarships that are right for you.
          </p>
        </div>

        {/* Footer links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">COLLEGES</h3>
            <ul className="space-y-2">
              {footerLinks.colleges.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-gray-600 hover:text-[#1a5d3a] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">GRADUATE SCHOOLS</h3>
            <ul className="space-y-2">
              {footerLinks.graduate.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-gray-600 hover:text-[#1a5d3a] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">SCHOLARSHIPS</h3>
            <ul className="space-y-2">
              {footerLinks.scholarships.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-gray-600 hover:text-[#1a5d3a] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">ABOUT</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-gray-600 hover:text-[#1a5d3a] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social links and work link */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-300 pt-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <span className="text-sm text-gray-600">Do you work for a school or college?</span>
            <Link to="/for-schools" className="text-sm text-[#1a5d3a] font-semibold hover:underline">
              Claim Your School
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-500 hover:text-[#1a5d3a] transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-500 hover:text-[#1a5d3a] transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-500 hover:text-[#1a5d3a] transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-500 hover:text-[#1a5d3a] transition-colors">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Bottom links */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-xs text-gray-500">
          <span>© 2025 Student Signal</span>
          <Link to="/privacy" className="hover:text-[#1a5d3a]">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-[#1a5d3a]">Terms of Service</Link>
          <Link to="/accessibility" className="hover:text-[#1a5d3a]">Accessibility</Link>
        </div>

        {/* App store buttons */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <a href="#" className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            <span>App Store</span>
          </a>
          <a href="#" className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
            </svg>
            <span>Google Play</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
