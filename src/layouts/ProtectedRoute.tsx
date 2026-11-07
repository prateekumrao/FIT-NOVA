// Purpose: Guards private pages. Signed-out visitors are sent to /login; users who skipped setup go to /onboarding.
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ requireOnboarded = true }: { requireOnboarded?: boolean }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (requireOnboarded && !user.onboarded) return <Navigate to="/onboarding" replace />;
  return <Outlet />;
}
