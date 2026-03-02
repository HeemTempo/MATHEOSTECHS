import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  AlertCircle, 
  Users, 
  LogOut,
  PlusCircle,
  Menu,
  X,
  UserCheck
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/auth';
import { Button } from './ui/button';
import { USER_ROLES } from '../utils/constants';

export function Sidebar() {
  const location = useLocation();
  const { user, clearAuth } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Silent error handling
    } finally {
      clearAuth();
    }
  };

  // Dynamic navigation based on role
  const getNavItems = () => {
    const baseItems = [
      {
        label: 'Dashboard',
        icon: LayoutDashboard,
        path: '/dashboard',
        roles: [USER_ROLES.REPORTER, USER_ROLES.OPERATOR, USER_ROLES.ADMIN],
      },
    ];

    // Operator sees "Assigned Incidents"
    if (user?.role === USER_ROLES.OPERATOR) {
      baseItems.push({
        label: 'Assigned Incidents',
        icon: AlertCircle,
        path: '/incidents',
        roles: [USER_ROLES.OPERATOR],
      });
    } else {
      // Reporter and Admin see "Incidents"
      baseItems.push({
        label: 'Incidents',
        icon: AlertCircle,
        path: '/incidents',
        roles: [USER_ROLES.REPORTER, USER_ROLES.ADMIN],
      });
    }

    // Add remaining items
    baseItems.push(
      {
        label: 'Create Incident',
        icon: PlusCircle,
        path: '/incidents/create',
        roles: [USER_ROLES.REPORTER, USER_ROLES.ADMIN],
      },
      {
        label: 'Assign Incidents',
        icon: UserCheck,
        path: '/admin/assign',
        roles: [USER_ROLES.ADMIN],
      },
      {
        label: 'Users',
        icon: Users,
        path: '/admin/users',
        roles: [USER_ROLES.ADMIN],
      }
    );

    return baseItems;
  };

  const navItems = getNavItems();

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role as any)
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#1a1d27] border border-[#2e3149] text-white"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-[#1a1d27] border-r border-[#2e3149] h-screen flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[#2e3149]">
          <h2 className="text-xl font-bold text-white">Incident Log</h2>
          <p className="text-sm text-slate-400 mt-1 truncate">{user?.name}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    : 'text-slate-400 hover:bg-[#2e3149] hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#2e3149]">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-400 hover:text-white hover:bg-[#2e3149]"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}
