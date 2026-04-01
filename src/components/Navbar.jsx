import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../utils/auth';
import logo from '../assets/logo.png';

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src={logo} alt="Papa Pinky" className="navbar-logo" />
        Papa Pinky Meal Service
      </Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/payment">Pricing/Payment</Link>
        {!user && <Link to="/login">Login</Link>}
        {user?.role === 'house' && user.approved && (
          <Link to={`/house/${user.id}`}>Dashboard</Link>
        )}
        {user?.role === 'chef' && (
          <Link to="/chef">Dashboard</Link>
        )}
        {user && (
          <button onClick={handleLogout} className="navbar-logout">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
