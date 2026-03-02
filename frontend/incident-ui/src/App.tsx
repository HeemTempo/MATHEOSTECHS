import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { IncidentsListPage } from './pages/IncidentsListPage';
import { CreateIncidentPage } from './pages/CreateIncidentPage';
import IncidentDetailPage from './pages/IncidentDetailPage';
import AdminUsersPage from './pages/AdminUsersPage';
import { AssignIncidentsPage } from './pages/AssignIncidentsPage';
import { USER_ROLES } from './utils/constants';

function App() {
  const { initAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} 
      />
      
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} 
      />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/incidents"
        element={
          <ProtectedRoute>
            <IncidentsListPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/incidents/create"
        element={
          <ProtectedRoute>
            <CreateIncidentPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/incidents/:id"
        element={
          <ProtectedRoute>
            <IncidentDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/assign"
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <AssignIncidentsPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
