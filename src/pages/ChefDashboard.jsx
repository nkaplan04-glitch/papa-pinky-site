import { useEffect, useState } from 'react';
import { houses } from '../data/mockUsers';
import { defaultSubmissions } from '../data/mockSubmissions';
import { loadSubmissions } from '../utils/storage';
import SummaryCard from '../components/SummaryCard';

export default function ChefDashboard() {
  const [submissions, setSubmissions] = useState({});

  useEffect(() => {
    const stored = loadSubmissions();
    setSubmissions(stored || defaultSubmissions);
  }, []);

  const totalHouses = houses.length;
  const submittedCount = houses.filter((h) => submissions[h.id]).length;
  const notSubmittedCount = totalHouses - submittedCount;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateString = tomorrow.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="page chef-dashboard">
      <div className="dashboard-header">
        <h1>Chef Dashboard</h1>
        <p className="dashboard-date">Orders for {dateString}</p>
      </div>

      <div className="chef-summary-bar">
        <div className="chef-stat">
          <span className="stat-number">{totalHouses}</span>
          <span className="stat-label">Total Houses</span>
        </div>
        <div className="chef-stat">
          <span className="stat-number stat-green">{submittedCount}</span>
          <span className="stat-label">Submitted</span>
        </div>
        <div className="chef-stat">
          <span className="stat-number stat-red">{notSubmittedCount}</span>
          <span className="stat-label">Not Submitted</span>
        </div>
      </div>

      <div className="chef-cards">
        {houses.map((house) => (
          <SummaryCard
            key={house.id}
            house={house}
            submission={submissions[house.id] || null}
          />
        ))}
      </div>
    </div>
  );
}
