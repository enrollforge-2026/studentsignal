import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  FileText,
  Image,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Colleges', href: '/admin/colleges', icon: GraduationCap },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Content', href: '/admin/content', icon: FileText },
    { label: 'Media', href: '/admin/media', icon: Image },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-sand-light flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-emerald-dark to-emerald transform transition-transform duration-200 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 p-6 border-b border-white/10">
            <span className="text-xl font-extrabold text-white">STUDENT</span>
            <span className="bg-tangerine text-white text-xs px-2 py-1 rounded-lg font-bold">ADMIN</span>
          </div>

          {/* Navigation */}
          <nav className="flex-grow p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-tangerine text-white shadow-glow-tangerine' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3.5 w-full text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <LogOut size={20} />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-grow flex flex-col">
        {/* Top bar */}
        <header className="bg-white shadow-sm h-18 flex items-center justify-between px-6 py-4">
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-sand"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <button className="relative p-2.5 text-gray-400 hover:text-emerald hover:bg-sand rounded-xl transition-all">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-tangerine rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald rounded-xl flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="text-sm font-semibold text-gray-700">Admin</span>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-grow p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
