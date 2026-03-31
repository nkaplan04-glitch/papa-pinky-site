import { useEffect, useState } from 'react';
import { loadAllHouses, loadAllSubmissions, approveHouse, rejectHouse } from '../utils/storage';
import SummaryCard from '../components/SummaryCard';

export default function ChefDashboard() {
  const [houses, setHouses] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(true);

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

  async function handleApprove(houseId) {
    try {
      await approveHouse(houseId);
      await loadData();
    } catch (err) {
      console.error('Failed to approve:', err);
    }
  }

  async function handleReject(houseId) {
    try {
      await rejectHouse(houseId);
      await loadData();
    } catch (err) {
      console.error('Failed to reject:', err);
    }
  }

  const approvedHouses = houses.filter((h) => h.approved);
  const pendingHouses = houses.filter((h) => !h.approved);
  const submittedCount = approvedHouses.filter((h) => submissions[h.id]).length;
  const notSubmittedCount = approvedHouses.length - submittedCount;
  const totalServings = approvedHouses.reduce((sum, h) => {
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

      {pendingHouses.length > 0 && (
        <div className="approval-section">
          <h2>Pending Approval ({pendingHouses.length})</h2>
          <div className="approval-cards">
            {pendingHouses.map((house) => (
              <div key={house.id} className="approval-card">
                <div className="approval-info">
                  <strong>{house.house_name}</strong>
                  <span>{house.headcount} people on meal plan</span>
                </div>
                <div className="approval-actions">
                  <button
                    className="btn-approve"
                    onClick={() => handleApprove(house.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => handleReject(house.id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="chef-summary-bar">
        <div className="chef-stat">
          <span className="stat-number">{approvedHouses.length}</span>
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
        {approvedHouses.map((house) => (
          <SummaryCard
            key={house.id}
            house={{ id: house.id, name: house.house_name }}
            submission={submissions[house.id] || null}
            headcount={house.headcount}
          />
        ))}
        {approvedHouses.length === 0 && (
          <p className="summary-empty">No approved houses yet.</p>
        )}
      </div>
    </div>
  );
}
