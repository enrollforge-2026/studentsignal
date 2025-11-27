import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { navLinks } from '../../data/mockData';
import { Search, Menu, X, ChevronDown, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';
import MegaMenu, { MegaMenuSection } from '../navigation/MegaMenu';
import EnterpriseSearch from '../navigation/EnterpriseSearch';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/colleges?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  // Handle ESC to close search
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSearchOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navigation Bar */}
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
            <Link to="/colleges" className="text-sm font-medium text-gray-700 hover:text-[#1a5d3a] transition-colors">
              College Search
            </Link>

            <MegaMenu label="Student Pathways" menuKey="student_pathways">
              <MegaMenuSection title="Pathways" links={[
                { label: 'K-12 Counselors & Districts', href: '/for-schools' },
                { label: 'Online Colleges', href: '/online-colleges' },
                { label: 'Military & Veteran Programs', href: '/military-programs' },
                { label: 'International Students', href: '/international-students' },
                { label: 'Transfer Students', href: '/transfer-students' },
              ]} />
            </MegaMenu>

            <MegaMenu label="Tools" menuKey="tools">
              <div className="grid grid-cols-2 gap-8">
                <MegaMenuSection title="Planning Tools" links={[
                  { label: 'Scholarships', href: '/scholarships' },
                  { label: 'Compare Schools', href: '/colleges' },
                  { label: 'Saved Schools', href: '/signal-hub' },
                ]} />
                <MegaMenuSection title="Discovery Tools" links={[
                  { label: 'Career Finder', href: '/career-finder' },
                  { label: 'Direct Admissions', href: '/direct-admissions' },
                  { label: 'School Match Quiz', href: '/school-match-quiz' },
                ]} />
              </div>
            </MegaMenu>

            <MegaMenu label="Resources" menuKey="resources">
              <MegaMenuSection title="Learn & Explore" links={[
                { label: 'Articles & Guides', href: '/articles' },
                { label: 'Rankings', href: '/rankings' },
                { label: 'Financial Aid', href: '/financial-aid' },
                { label: 'SAT/ACT Alternatives', href: '/test-alternatives' },
                { label: 'Application Tips', href: '/application-tips' },
                { label: 'Student Stories', href: '/student-stories' },
              ]} />
            </MegaMenu>

            {user && (
              <Link to="/signal-hub" className="text-sm font-medium text-gray-700 hover:text-[#1a5d3a] transition-colors">
                Signal Hub
              </Link>
            )}
          </nav>

          {/* Search Icon & Auth */}
          <div className="flex items-center gap-3">
            {/* Enterprise Search Icon */}
            <button
              onClick={toggleSearch}
              className="hidden md:flex items-center justify-center w-10 h-10 text-gray-700 hover:text-[#1a5d3a] transition-all duration-180 rounded-lg hover:bg-gray-50 hover:scale-105 hover:shadow-md"
              style={{ boxShadow: isSearchOpen ? 'none' : undefined }}
              aria-label="Search schools"
            >
              <Search size={22} strokeWidth={2} />
            </button>

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

        {/* Expanded Search Bar - Below Main Nav */}
        {isSearchExpanded && (
          <div className="border-t border-gray-100 py-3 hidden md:block">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search schools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5d3a]/20 focus:border-[#1a5d3a] transition-all"
              />
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
