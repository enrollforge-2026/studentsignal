import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';
import MegaMenu, { MegaMenuSection } from '../navigation/MegaMenu';

const HeaderWithMegaMenu = () => {
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

  const studentPathwaysLinks = [
    { label: 'K-12 Counselors & Districts', href: '/for-schools' },
    { label: 'Online Colleges', href: '/online-colleges' },
    { label: 'Military & Veteran Programs', href: '/military-programs' },
    { label: 'International Students', href: '/international-students' },
    { label: 'Transfer Students', href: '/transfer-students' },
  ];

  const toolsLinks = [
    { label: 'Scholarships', href: '/scholarships' },
    { label: 'Compare Schools', href: '/colleges' },
    { label: 'Saved Schools', href: '/signal-hub?view=schools' },
    { label: 'Career Finder', href: '/career-finder' },
    { label: 'Direct Admissions', href: '/direct-admissions' },
    { label: 'School Match Quiz', href: '/school-match-quiz' },
  ];

  const resourcesLinks = [
    { label: 'Articles & Guides', href: '/articles' },
    { label: 'Rankings', href: '/rankings' },
    { label: 'Financial Aid', href: '/financial-aid' },
    { label: 'SAT/ACT Alternatives', href: '/test-alternatives' },
    { label: 'Application Tips', href: '/application-tips' },
    { label: 'Student Stories', href: '/student-stories' },
  ];

  return (
    <header className=\"sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm\">
      <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
        <div className=\"flex items-center justify-between h-16\">
          {/* Logo */}
          <Link to=\"/\" className=\"flex items-center gap-2\">
            <div className=\"flex items-center\">
              <span className=\"text-2xl font-bold text-[#1a5d3a]\">STUDENT</span>
              <div className=\"flex items-center ml-1\">
                <span className=\"bg-[#1a5d3a] text-white text-xs px-1.5 py-0.5 rounded font-semibold\">SIGNAL</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className=\"hidden lg:flex items-center gap-6\">
            <Link
              to=\"/colleges\"
              className=\"text-sm font-medium text-gray-700 hover:text-[#1a5d3a] transition-colors\"
            >
              College Search
            </Link>

            <MegaMenu label=\"Student Pathways\" menuKey=\"student_pathways\">
              <MegaMenuSection title=\"Pathways\" links={studentPathwaysLinks} />
            </MegaMenu>

            <MegaMenu label=\"Tools\" menuKey=\"tools\">
              <div className=\"grid grid-cols-2 gap-8\">
                <MegaMenuSection
                  title=\"Planning Tools\"
                  links={toolsLinks.slice(0, 3)}
                />
                <MegaMenuSection
                  title=\"Discovery Tools\"
                  links={toolsLinks.slice(3)}
                />
              </div>
            </MegaMenu>

            <MegaMenu label=\"Resources\" menuKey=\"resources\">
              <MegaMenuSection title=\"Learn & Explore\" links={resourcesLinks} />
            </MegaMenu>

            {user && (
              <Link
                to=\"/signal-hub\"
                className=\"text-sm font-medium text-gray-700 hover:text-[#1a5d3a] transition-colors\"
              >
                Signal Hub
              </Link>
            )}
          </nav>

          {/* Search & Auth */}
          <div className=\"flex items-center gap-3\">
            <form onSubmit={handleSearch} className=\"hidden md:flex items-center\">
              <div className=\"relative\">
                <Search className=\"absolute left-3 top-1/2 -translate-y-1/2 text-gray-400\" size={18} />
                <input
                  type=\"text\"
                  placeholder=\"Search schools...\"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className=\"pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full w-48 focus:w-64 focus:outline-none focus:ring-2 focus:ring-[#1a5d3a]/20 focus:border-[#1a5d3a] transition-all\"
                />
              </div>
            </form>

            {user ? (
              <>
                <Link to=\"/signal-hub\">
                  <Button variant=\"ghost\" size=\"sm\" className=\"text-gray-700 hover:text-[#1a5d3a] flex items-center gap-2\">
                    <LayoutDashboard size={18} />
                    Signal Hub
                  </Button>
                </Link>
                <button
                  onClick={logout}
                  className=\"text-sm font-medium text-gray-700 hover:text-red-600 transition-colors\"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to=\"/login\">
                  <Button variant=\"ghost\" size=\"sm\" className=\"text-gray-700 hover:text-[#1a5d3a]\">
                    Log In
                  </Button>
                </Link>

                <Link to=\"/signup\">
                  <Button size=\"sm\" className=\"bg-[#f5a623] hover:bg-[#e09000] text-white font-semibold\">
                    Join Free
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              className=\"lg:hidden p-2\"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className=\"lg:hidden py-4 border-t border-gray-100\">
            <form onSubmit={handleSearch} className=\"mb-4\">
              <div className=\"relative\">
                <Search className=\"absolute left-3 top-1/2 -translate-y-1/2 text-gray-400\" size={18} />
                <input
                  type=\"text\"
                  placeholder=\"Search schools...\"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className=\"w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1a5d3a]/20 focus:border-[#1a5d3a]\"
                />
              </div>
            </form>
            <nav className=\"flex flex-col gap-4\">
              <Link to=\"/colleges\" className=\"text-sm font-medium text-gray-700\" onClick={() => setIsMenuOpen(false)}>
                College Search
              </Link>
              
              <div className=\"space-y-2\">
                <p className=\"text-xs font-bold text-gray-500 uppercase\">Student Pathways</p>
                {studentPathwaysLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className=\"block text-sm text-gray-600 pl-3\"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className=\"space-y-2\">
                <p className=\"text-xs font-bold text-gray-500 uppercase\">Tools</p>
                {toolsLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className=\"block text-sm text-gray-600 pl-3\"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className=\"space-y-2\">
                <p className=\"text-xs font-bold text-gray-500 uppercase\">Resources</p>
                {resourcesLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className=\"block text-sm text-gray-600 pl-3\"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {user && (
                <Link to=\"/signal-hub\" className=\"text-sm font-medium text-gray-700\" onClick={() => setIsMenuOpen(false)}>
                  Signal Hub
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderWithMegaMenu;
