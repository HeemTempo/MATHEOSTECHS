import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { USER_ROLES } from '../utils/constants';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import IncidentsListPage from '../pages/IncidentsListPage';
import IncidentDetailPage from '../pages/IncidentDetailPage';
import CreateIncidentPage from '../pages/CreateIncidentPage';
import AdminUsersPage from '../pages/AdminUsersPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/incidents',
    element: (
      <ProtectedRoute>
        <IncidentsListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/incidents/new',
    element: (
      <ProtectedRoute>
        <CreateIncidentPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/incidents/:id',
    element: (
      <ProtectedRoute>
        <IncidentDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/users',
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <AdminUsersPage />
      </ProtectedRoute>
    ),
  },
]);
