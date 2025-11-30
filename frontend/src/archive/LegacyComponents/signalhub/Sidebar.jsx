// ARCHIVED: Legacy Signal Hub component (pre-cleanup). Do not use in production.
import React from 'react';
import { LayoutDashboard, School, Award, CheckSquare, Bookmark, Mail, User } from 'lucide-react';

const Sidebar = ({ activeView, setActiveView, user }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'schools', label: 'Schools', icon: School },
    { id: 'scholarships', label: 'Scholarships', icon: Award },
    { id: 'todo', label: 'To-Do', icon: CheckSquare },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'offers', label: 'Offers', icon: Mail },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const getInitials = () => {
    if (!user) return 'U';
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Profile Avatar */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {user?.profile_picture_url ? (
            <img
              src={user.profile_picture_url}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1A535C] to-[#2d8659] flex items-center justify-center text-white font-bold">
              {getInitials()}
            </div>
          )}
          <div>
            <div className="font-semibold text-gray-900">{user?.first_name} {user?.last_name}</div>
            <div className="text-xs text-gray-500">Student</div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#1A535C] to-[#2d8659] text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-xs text-gray-500 text-center">
        Student Signal Hub
      </div>
    </div>
  );
};

export default Sidebar;
