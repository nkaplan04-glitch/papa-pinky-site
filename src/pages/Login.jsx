import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, getCurrentUser } from '../utils/auth';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Redirect if already logged in
  const existing = getCurrentUser();
  if (existing) {
    if (existing.role === 'chef') {
      navigate('/chef', { replace: true });
    } else {
      navigate(`/house/${existing.houseId}`, { replace: true });
    }
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const session = login(username, password);
    if (!session) {
      setError('Invalid username or password.');
      return;
    }

    if (session.role === 'chef') {
      navigate('/chef');
    } else {
      navigate(`/house/${session.houseId}`);
    }
  }

  return (
    <div className="page login-page">
      <div className="login-card">
        <h1>Log In</h1>
        <p className="login-helper">Each house has its own login.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
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
              autoComplete="current-password"
              required
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary btn-full">Log In</button>
        </form>
      </div>
    </div>
  );
}
