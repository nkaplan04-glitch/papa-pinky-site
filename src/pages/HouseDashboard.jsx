import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';
import { loadSubmissions, saveSubmissions } from '../utils/storage';
import { isOrderingLocked } from '../utils/cutoff';
import { validateSelections } from '../utils/validation';
import { breakfastOptions, lunchDinnerOptions, BREAKFAST_NOTE } from '../data/menuOptions';
import { defaultSubmissions } from '../data/mockSubmissions';
import StatusBanner from '../components/StatusBanner';
import SelectionSection from '../components/SelectionSection';

export default function HouseDashboard() {
  const { houseId } = useParams();
  const user = getCurrentUser();
  const locked = isOrderingLocked();

  const [breakfast, setBreakfast] = useState([]);
  const [lunch, setLunch] = useState(null);
  const [dinner, setDinner] = useState(null);
  const [errors, setErrors] = useState([]);
  const [saved, setSaved] = useState(false);

  // Load existing submission on mount
  useEffect(() => {
    const stored = loadSubmissions();
    const all = stored || defaultSubmissions;
    const existing = all[houseId];
    if (existing) {
      setBreakfast(existing.breakfast || []);
      setLunch(existing.lunch || null);
      setDinner(existing.dinner || null);
      setSaved(true);
    }
  }, [houseId]);

  function handleSubmit() {
    const validationErrors = validateSelections(breakfast, lunch, dinner);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setSaved(false);
      return;
    }

    setErrors([]);

    const stored = loadSubmissions() || { ...defaultSubmissions };
    stored[houseId] = {
      breakfast,
      lunch,
      dinner,
      submittedAt: new Date().toISOString(),
    };
    saveSubmissions(stored);
    setSaved(true);
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateString = tomorrow.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="page house-dashboard">
      <div className="dashboard-header">
        <h1>{user?.houseName || houseId}</h1>
        <h2>Next Day Meal Selection</h2>
        <p className="dashboard-date">{dateString}</p>
      </div>

      <StatusBanner />

      {locked && (
        <div className="locked-message">
          Ordering is closed. You can view your selections below but cannot make changes.
        </div>
      )}

      <SelectionSection
        title="Breakfast"
        note={BREAKFAST_NOTE}
        options={breakfastOptions}
        selected={breakfast}
        onChange={setBreakfast}
        maxSelections={2}
        disabled={locked}
      />

      <SelectionSection
        title="Lunch"
        options={lunchDinnerOptions}
        selected={lunch}
        onChange={setLunch}
        maxSelections={1}
        disabled={locked}
      />

      <SelectionSection
        title="Dinner"
        options={lunchDinnerOptions}
        selected={dinner}
        onChange={setDinner}
        maxSelections={1}
        disabled={locked}
      />

      {errors.length > 0 && (
        <div className="validation-errors">
          {errors.map((err) => (
            <p key={err}>{err}</p>
          ))}
        </div>
      )}

      {!locked && (
        <button onClick={handleSubmit} className="btn btn-primary btn-full submit-btn">
          {saved ? 'Update Selections' : 'Submit Selections'}
        </button>
      )}

      {saved && <p className="saved-message">Your selections have been saved.</p>}
    </div>
  );
}
