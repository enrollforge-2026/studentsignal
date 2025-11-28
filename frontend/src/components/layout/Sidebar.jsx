import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  Award, 
  GraduationCap,
  FileText,
  Calendar,
  CheckSquare,
  MessageSquare,
  Calculator,
  TrendingUp,
  User,
  Settings,
  FolderOpen,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    {
      section: 'EXPLORE',
      items: [
        { name: 'Colleges', href: '/explore/colleges', icon: Search },
        { name: 'Scholarships', href: '/explore/scholarships', icon: Award },
        { name: 'Majors', href: '/explore/majors', icon: GraduationCap },
      ],
    },
    {
      section: 'PLAN',
      items: [
        { name: 'Application Tracker', href: '/plan/applications', icon: FileText },
        { name: 'Deadlines', href: '/plan/deadlines', icon: Calendar },
        { name: 'Tasks & Essays', href: '/plan/tasks', icon: CheckSquare },
      ],
    },
    {
      section: 'TOOLS',
      items: [
        { name: 'AI Coach', href: '/tools/coach', icon: MessageSquare },
        { name: 'Cost Calculator', href: '/tools/cost', icon: Calculator },
        { name: 'Compare Colleges', href: '/tools/compare', icon: TrendingUp },
      ],
    },
    {
      section: 'ACCOUNT',
      items: [
        { name: 'Profile', href: '/account/profile', icon: User },
        { name: 'Settings', href: '/account/settings', icon: Settings },
        { name: 'Documents Vault', href: '/account/documents', icon: FolderOpen },
      ],
    },
  ];

  const isActive = (href) => location.pathname === href;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-6 border-b border-gray-200">
        <Link to="/dashboard" className="flex items-center">
          <span className="text-xl font-bold" style={{ color: '#004C3F' }}>STUDENT</span>
          <span className="ml-1 text-xs px-1.5 py-0.5 rounded font-bold text-white" style={{ backgroundColor: '#004C3F' }}>SIGNAL</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navigation.map((group) => (
          <div key={group.section} className="mb-6">
            <div className="text-xs uppercase tracking-wide text-gray-500 px-4 py-2 font-semibold">
              {group.section}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors relative ${
                      active
                        ? 'bg-gray-50 text-gray-900 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {active && (
                      <div className="absolute left-0 w-1 h-full rounded-r" style={{ backgroundColor: '#004C3F' }} />
                    )}
                    <Icon size={20} className={active ? '' : 'text-gray-500'} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer placeholder */}
      <div className="border-t border-gray-200 p-4">
        <div className="text-xs text-gray-500">
          {/* Activity stats placeholder */}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-md bg-white border border-gray-200 shadow-sm"
      >
        <Menu size={20} />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-60 bg-white border-r border-gray-200">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Slide-over panel */}
          <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 lg:hidden">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;
