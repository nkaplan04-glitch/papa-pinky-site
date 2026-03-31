import { useEffect, useState } from 'react';
import { loadAllHouses, loadAllSubmissions, deleteHouse } from '../utils/storage';
import { createHouseAccount } from '../utils/auth';
import SummaryCard from '../components/SummaryCard';

export default function ChefDashboard() {
  const [houses, setHouses] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [formHouseName, setFormHouseName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formHeadcount, setFormHeadcount] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  async function loadData() {
    try {
      const [allHouses, allSubs] = await Promise.all([
        loadAllHouses(),
        loadAllSubmissions(),
      ]);
      setHouses(allHouses);
      setSubmissions(allSubs);
    } catch (err) {
      console.error('Failed to load chef dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  async function handleCreateAccount(e) {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setFormLoading(true);

    if (!formHouseName.trim() || !formEmail.trim() || !formPassword || !formHeadcount) {
      setFormError('All fields are required.');
      setFormLoading(false);
      return;
    }

    if (formPassword.length < 6) {
      setFormError('Password must be at least 6 characters.');
      setFormLoading(false);
      return;
    }

    try {
      await createHouseAccount({
        email: formEmail.trim(),
        password: formPassword,
        houseName: formHouseName.trim(),
        headcount: parseInt(formHeadcount, 10),
      });
      setFormSuccess(`Account created for ${formHouseName.trim()}. Send them their login credentials.`);
      setFormHouseName('');
      setFormEmail('');
      setFormPassword('');
      setFormHeadcount('');
      await loadData();
    } catch (err) {
      setFormError(err.message || 'Failed to create account.');
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(houseId, houseName) {
    if (!window.confirm(`Remove ${houseName}? This will delete their account and all their orders.`)) {
      return;
    }
    try {
      await deleteHouse(houseId);
      await loadData();
    } catch (err) {
      console.error('Failed to delete house:', err);
    }
  }

  const submittedCount = houses.filter((h) => submissions[h.id]).length;
  const notSubmittedCount = houses.length - submittedCount;
  const totalServings = houses.reduce((sum, h) => {
    const sub = submissions[h.id];
    return sum + (sub?.dailyHeadcount || 0);
  }, 0);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateString = tomorrow.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  if (loading) {
    return <div className="page chef-dashboard"><p>Loading...</p></div>;
  }

  return (
    <div className="page chef-dashboard">
      <div className="dashboard-header">
        <h1>Chef Dashboard</h1>
        <p className="dashboard-date">Orders for {dateString}</p>
      </div>

      <div className="create-account-section">
        <div className="create-account-header">
          <h2>Manage Houses</h2>
          <button
            className="btn btn-primary"
            onClick={() => { setShowForm(!showForm); setFormError(''); setFormSuccess(''); }}
          >
            {showForm ? 'Cancel' : '+ New House Account'}
          </button>
        </div>

        {showForm && (
          <form className="create-account-form" onSubmit={handleCreateAccount}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ca-house">House Name</label>
                <input
                  id="ca-house"
                  type="text"
                  placeholder="e.g. Sigma Chi"
                  value={formHouseName}
                  onChange={(e) => setFormHouseName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="ca-headcount">Headcount</label>
                <input
                  id="ca-headcount"
                  type="number"
                  min="1"
                  placeholder="e.g. 30"
                  value={formHeadcount}
                  onChange={(e) => setFormHeadcount(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ca-email">Email</label>
                <input
                  id="ca-email"
                  type="email"
                  placeholder="house@example.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="ca-password">Password</label>
                <input
                  id="ca-password"
                  type="text"
                  placeholder="At least 6 characters"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            {formError && <p className="form-error">{formError}</p>}
            {formSuccess && <p className="form-success">{formSuccess}</p>}
            <button type="submit" className="btn btn-primary" disabled={formLoading}>
              {formLoading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
        )}

        {houses.length > 0 && (
          <div className="house-list">
            {houses.map((house) => (
              <div key={house.id} className="house-list-item">
                <div className="house-list-info">
                  <strong>{house.house_name}</strong>
                  <span>{house.headcount} people on meal plan</span>
                </div>
                <button
                  className="btn-reject"
                  onClick={() => handleDelete(house.id, house.house_name)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="chef-summary-bar">
        <div className="chef-stat">
          <span className="stat-number">{houses.length}</span>
          <span className="stat-label">Active Houses</span>
        </div>
        <div className="chef-stat">
          <span className="stat-number stat-green">{submittedCount}</span>
          <span className="stat-label">Submitted</span>
        </div>
        <div className="chef-stat">
          <span className="stat-number stat-red">{notSubmittedCount}</span>
          <span className="stat-label">Not Submitted</span>
        </div>
        <div className="chef-stat">
          <span className="stat-number">{totalServings}</span>
          <span className="stat-label">Total Servings</span>
        </div>
      </div>

      <div className="chef-cards">
        {houses.map((house) => (
          <SummaryCard
            key={house.id}
            house={{ id: house.id, name: house.house_name }}
            submission={submissions[house.id] || null}
            headcount={house.headcount}
          />
        ))}
        {houses.length === 0 && (
          <p className="summary-empty">No houses yet. Create an account to get started.</p>
        )}
      </div>
    </div>
  );
}
