import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../utils/auth';

export default function Register() {
  const navigate = useNavigate();
  const [houseName, setHouseName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [headcount, setHeadcount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!houseName.trim() || !email.trim() || !password || !headcount) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      await register({
        email: email.trim(),
        password,
        houseName: houseName.trim(),
        headcount: parseInt(headcount, 10),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="page login-page">
        <div className="login-card">
          <h1>Request Submitted</h1>
          <p className="register-success">
            Your house has been registered. The chef will review and approve your
            account before you can start ordering.
          </p>
          <Link to="/login" className="btn btn-primary btn-full" style={{ marginTop: '20px' }}>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page login-page">
      <div className="login-card">
        <h1>Register Your House</h1>
        <p className="login-helper">
          Create an account for your house. The chef will approve it before you can order.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="houseName">House Name</label>
            <input
              id="houseName"
              type="text"
              placeholder="e.g. Sigma Chi"
              value={houseName}
              onChange={(e) => setHouseName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="house@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="headcount">People on the Meal Plan</label>
            <input
              id="headcount"
              type="number"
              min="1"
              placeholder="e.g. 30"
              value={headcount}
              onChange={(e) => setHeadcount(e.target.value)}
              required
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="register-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
