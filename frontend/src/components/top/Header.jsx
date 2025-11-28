import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';
import MegaMenu, { MegaMenuSection } from '../navigation/MegaMenu';

const Header = ({ onSearchOpen }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm" style={{ zIndex: 50 }}>
      <div className="max-w-[1220px] mx-auto px-4">
        {/* Desktop Header */}
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
            <Link
              to="/colleges"
              className="text-sm font-medium text-gray-700 hover:text-[#1a5d3a] transition-colors"
            >
              College Search
            </Link>

            <MegaMenu label="Student Pathways" menuKey="student_pathways">
              <MegaMenuSection
                title="Pathways"
                links={[
                  { label: 'K-12 Counselors & Districts', href: '/for-schools' },
                  { label: 'Online Colleges', href: '/online-colleges' },
                  { label: 'Military & Veteran Programs', href: '/military-programs' },
                  { label: 'International Students', href: '/international-students' },
                  { label: 'Transfer Students', href: '/transfer-students' },
                ]}
              />
            </MegaMenu>

            <MegaMenu label="Tools" menuKey="tools">
              <div className="grid grid-cols-2 gap-8">
                <MegaMenuSection
                  title="Planning Tools"
                  links={[
                    { label: 'Scholarships', href: '/scholarships' },
                    { label: 'Compare Schools', href: '/colleges' },
                    { label: 'Saved Schools', href: '/signal-hub' },
                  ]}
                />
                <MegaMenuSection
                  title="Discovery Tools"
                  links={[
                    { label: 'Career Finder', href: '/career-finder' },
                    { label: 'Direct Admissions', href: '/direct-admissions' },
                    { label: 'School Match Quiz', href: '/school-match-quiz' },
                  ]}
                />
              </div>
            </MegaMenu>

            <MegaMenu label="Resources" menuKey="resources">
              <MegaMenuSection
                title="Learn & Explore"
                links={[
                  { label: 'Articles & Guides', href: '/articles' },
                  { label: 'Rankings', href: '/rankings' },
                  { label: 'Financial Aid', href: '/financial-aid' },
                  { label: 'SAT/ACT Alternatives', href: '/test-alternatives' },
                  { label: 'Application Tips', href: '/application-tips' },
                  { label: 'Student Stories', href: '/student-stories' },
                ]}
              />
            </MegaMenu>

            {user && (
              <Link
                to="/signal-hub"
                className="text-sm font-medium text-gray-700 hover:text-[#1a5d3a] transition-colors"
              >
                Signal Hub
              </Link>
            )}
          </nav>

          {/* Right Utilities */}
          <div className="flex items-center gap-3">
            {/* Search Icon */}
            <button
              onClick={onSearchOpen}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:text-[#1a5d3a] hover:bg-[#F9FAFB] transition-all duration-150"
              style={{ transform: 'scale(1)', transition: 'all 150ms ease-out' }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              aria-label="Search schools"
            >
              <Search size={22} strokeWidth={2} style={{ color: '#374151' }} />
            </button>

            {user ? (
              <>
                <button
                  onClick={logout}
                  className="hidden lg:block text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="hidden lg:flex text-gray-700 hover:text-[#1a5d3a]">
                    Log In
                  </Button>
                </Link>

                <Link to="/signup">
                  <Button
                    size="sm"
                    className="hidden lg:flex bg-[#f5a623] hover:bg-[#e09000] text-white font-semibold"
                  >
                    Join Free
                  </Button>
                </Link>

                <Link to="/staff-login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden lg:flex text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-300"
                  >
                    Staff Login
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-3">
              <Link
                to="/colleges"
                className="text-sm font-medium text-gray-700 hover:text-[#1a5d3a] py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                College Search
              </Link>
              <Link
                to="/scholarships"
                className="text-sm font-medium text-gray-700 hover:text-[#1a5d3a] py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Scholarships
              </Link>
              <Link
                to="/articles"
                className="text-sm font-medium text-gray-700 hover:text-[#1a5d3a] py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Articles & Guides
              </Link>
              {user && (
                <Link
                  to="/signal-hub"
                  className="text-sm font-medium text-gray-700 hover:text-[#1a5d3a] py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Signal Hub
                </Link>
              )}
              {!user && (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-700 hover:text-[#1a5d3a] py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="text-sm font-medium text-gray-700 hover:text-[#1a5d3a] py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Join Free
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
