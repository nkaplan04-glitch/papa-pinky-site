import { Link, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../utils/auth';
import logo from '../assets/logo.png';

export default function Navbar() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  function handleLogout() {
    logout();
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
        <Link to="/payment">Payment</Link>
        {!user && <Link to="/login">Login</Link>}
        {user?.role === 'house' && (
          <Link to={`/house/${user.houseId}`}>Dashboard</Link>
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
