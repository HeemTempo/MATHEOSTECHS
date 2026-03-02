import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Sidebar } from '../components/Sidebar';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-slate-400">You don't have permission to view this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1117]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
