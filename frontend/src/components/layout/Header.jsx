import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { navLinks } from '../../data/mockData';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/colleges?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-sand-dark/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center">
              <span className="text-2xl font-extrabold text-emerald group-hover:text-emerald-dark transition-colors">STUDENT</span>
              <div className="flex items-center ml-1.5">
                <span className="bg-emerald group-hover:bg-emerald-dark text-white text-xs px-2 py-1 rounded-lg font-bold tracking-wide transition-colors">SIGNAL</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-semibold text-gray-700 hover:text-emerald transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-tangerine to-lavender group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
            <button className="text-sm font-semibold text-gray-700 hover:text-emerald flex items-center gap-1">
              <ChevronDown size={16} />
            </button>
          </nav>

          {/* Search & Auth */}
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search schools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 pr-5 py-2.5 text-sm border-2 border-sand-dark rounded-xl w-48 focus:w-64 focus:outline-none focus:ring-2 focus:ring-turquoise/20 focus:border-turquoise transition-all bg-sand-light/50"
                />
              </div>
            </form>

            <Link to="/login">
              <Button variant="ghost" className="text-gray-700 hover:text-emerald font-semibold">
                Log In
              </Button>
            </Link>

            <Link to="/signup">
              <Button className="bg-tangerine hover:bg-tangerine-dark text-white font-bold px-6 rounded-xl shadow-md hover:shadow-glow-tangerine transition-all">
                Join Free
              </Button>
            </Link>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-sand transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-sand-dark/30 animate-slideUp">
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search schools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-5 py-3 text-sm border-2 border-sand-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-turquoise/20 focus:border-turquoise bg-sand-light/50"
                />
              </div>
            </form>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm font-semibold text-gray-700 hover:text-emerald hover:bg-sand py-3 px-4 rounded-xl transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
