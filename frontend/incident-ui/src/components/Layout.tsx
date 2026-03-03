import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { USER_ROLES } from '../utils/constants';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <nav className="bg-[#1a1d27] border-b border-[#2e3149]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/dashboard" className="flex items-center text-xl font-bold text-white">
                Incident Log
              </Link>
              <div className="ml-10 flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/incidents"
                  className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Incidents
                </Link>
                {user?.role === USER_ROLES.ADMIN && (
                  <Link
                    to="/admin/users"
                    className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Users
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-400 text-sm">
                {user?.name} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
};
