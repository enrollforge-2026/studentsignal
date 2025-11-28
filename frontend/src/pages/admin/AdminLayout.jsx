import React from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, GraduationCap, Award, BarChart3, FileText, LogOut, Home, Megaphone } from 'lucide-react';

const AdminLayout = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is admin or superadmin
  if (!isAuthenticated || !['admin', 'superadmin'].includes(user?.role)) {
    return <Navigate to="/staff-login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/colleges', label: 'Colleges', icon: GraduationCap },
    { path: '/admin/scholarships', label: 'Scholarships', icon: Award },
    { path: '/admin/articles', label: 'Articles', icon: FileText },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F7F8' }}>
      {/* Header */}
      <header className="bg-white sticky top-0 z-50" style={{ borderBottom: '1px solid #E2E5E7' }}>
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 text-xl font-bold" style={{ color: '#10614E' }}>
                <span>STUDENT</span>
                <span className="text-white px-2 py-0.5 text-sm" style={{ backgroundColor: '#10614E', borderRadius: '4px' }}>SIGNAL</span>
              </Link>
              <span className="text-sm font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Admin Panel</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 text-sm transition-colors"
                style={{ color: '#1A1A1A' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#10614E'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#1A1A1A'}
              >
                <Home size={18} />
                <span>View Site</span>
              </Link>
              <div className="text-sm" style={{ color: '#6B7280' }}>
                {user?.first_name} {user?.last_name}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm transition-colors"
                style={{ color: '#EF4444', borderRadius: '6px' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="bg-white p-4 sticky top-24" style={{ borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className="flex items-center gap-3 px-4 py-3 transition-all font-medium"
                        style={{
                          borderRadius: '6px',
                          backgroundColor: isActive ? '#10614E' : 'transparent',
                          color: isActive ? '#FFFFFF' : '#1A1A1A',
                          boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) e.currentTarget.style.backgroundColor = '#F5F7F8';
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
