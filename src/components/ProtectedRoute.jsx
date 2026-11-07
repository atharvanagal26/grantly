import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '../context/AppContext.jsx';

export default function ProtectedRoute({ role }) {
  const { session } = useSession();
  const location = useLocation();
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (role && session.role !== role) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
