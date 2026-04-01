import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { submitSuggestion, loadHouseSuggestions } from '../utils/storage';

const CATEGORIES = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch_dinner', label: 'Lunch / Dinner' },
  { value: 'general', label: 'General' },
];

const STATUS_LABELS = {
  pending: 'Pending',
  approved: 'Added to Menu',
  dismissed: 'Reviewed',
};

export default function Suggestions() {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [text, setText] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function loadData() {
    try {
      const data = await loadHouseSuggestions(user.id);
      setSuggestions(data);
    } catch (err) {
      console.error('Failed to load suggestions:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!text.trim()) {
      setError('Please enter a suggestion.');
      return;
    }

    setSubmitting(true);
    try {
      await submitSuggestion({
        houseId: user.id,
        suggestionText: text.trim(),
        category,
      });
      setSuccess('Suggestion submitted! Chef Roger will review it.');
      setText('');
      setCategory('general');
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to submit suggestion.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="page"><p>Loading...</p></div>;
  }

  return (
    <div className="page suggestions-page">
      <h1>Menu Suggestions</h1>
      <p className="suggestions-intro">
        Have an idea for a dish? Submit it below and Chef Roger will review it.
      </p>

      <form className="suggestion-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="suggestion-text">Your Suggestion</label>
          <textarea
            id="suggestion-text"
            placeholder="Describe the meal you'd like to see on the menu..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="suggestion-category">Category</label>
          <select
            id="suggestion-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Suggestion'}
        </button>
      </form>

      {suggestions.length > 0 && (
        <div className="suggestions-history">
          <h2>Your Suggestions</h2>
          <div className="suggestions-list">
            {suggestions.map((s) => (
              <div key={s.id} className={`suggestion-item suggestion-${s.status}`}>
                <div className="suggestion-content">
                  <p className="suggestion-text">{s.suggestion_text}</p>
                  <span className="suggestion-category">
                    {CATEGORIES.find((c) => c.value === s.category)?.label || s.category}
                  </span>
                </div>
                <span className={`suggestion-status status-${s.status}`}>
                  {STATUS_LABELS[s.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
