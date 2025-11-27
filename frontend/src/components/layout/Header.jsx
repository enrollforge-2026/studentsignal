import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { navLinks } from '../../data/mockData';
import { Search, Menu, X, ChevronDown, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/colleges?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-[#1a5d3a]">STUDENT</span>
              <div className="flex items-center ml-1">
                <span className="bg-[#1a5d3a] text-white text-xs px-1.5 py-0.5 rounded font-semibold">SIGNAL</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium text-gray-700 hover:text-[#1a5d3a] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <button className="text-sm font-medium text-gray-700 hover:text-[#1a5d3a] flex items-center gap-1">
              <ChevronDown size={16} />
            </button>
          </nav>

          {/* Search & Auth */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search schools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full w-48 focus:w-64 focus:outline-none focus:ring-2 focus:ring-[#1a5d3a]/20 focus:border-[#1a5d3a] transition-all"
                />
              </div>
            </form>

            {user ? (
              <>
                <Link to="/signal-hub">
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:text-[#1a5d3a] flex items-center gap-2">
                    <LayoutDashboard size={18} />
                    Signal Hub
                  </Button>
                </Link>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:text-[#1a5d3a]">
                    Log In
                  </Button>
                </Link>

                <Link to="/signup">
                  <Button size="sm" className="bg-[#f5a623] hover:bg-[#e09000] text-white font-semibold">
                    Join Free
                  </Button>
                </Link>

                <Link to="/staff-login">
                  <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-300">
                    Staff Login
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search schools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1a5d3a]/20 focus:border-[#1a5d3a]"
                />
              </div>
            </form>
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm font-medium text-gray-700 hover:text-[#1a5d3a] py-2"
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
