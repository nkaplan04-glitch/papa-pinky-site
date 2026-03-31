import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="page"><p>Loading...</p></div>;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" replace />;

  if (user.role === 'house' && !user.approved) {
    return (
      <div className="page">
        <div className="locked-message">
          Your account is not active yet. Please contact Chef Roger.
        </div>
      </div>
    );
  }

  return children;
}
