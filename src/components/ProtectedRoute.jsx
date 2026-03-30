import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';

export default function ProtectedRoute({ children, allowedRole, houseId }) {
  const user = getCurrentUser();

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" replace />;

  // Houses can only view their own page
  if (user.role === 'house' && houseId && user.houseId !== houseId) {
    return <Navigate to={`/house/${user.houseId}`} replace />;
  }

  return children;
}
