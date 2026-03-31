import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, getCurrentUser } from '../utils/auth';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email.trim(), password);
      const user = await getCurrentUser();

      if (!user) {
        setError('Login failed. Please try again.');
        setLoading(false);
        return;
      }

      if (user.role === 'chef') {
        navigate('/chef');
      } else if (user.approved) {
        navigate(`/house/${user.id}`);
      } else {
        setError('Your account is not active yet. Please contact Chef Roger.');
        setLoading(false);
        return;
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page login-page">
      <div className="login-card">
        <h1>Log In</h1>
        <p className="login-helper">Log in with the credentials provided by Chef Roger.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
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
              autoComplete="current-password"
              required
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <p className="register-link">
          Need an account? Contact Chef Roger to get set up.
        </p>
      </div>
    </div>
  );
}
