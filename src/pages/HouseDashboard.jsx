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

const TIME_OPTIONS = {
  breakfast: ['7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'],
  lunch: ['11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM'],
  dinner: ['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM'],
};

export default function HouseDashboard() {
  const { houseId } = useParams();
  const user = getCurrentUser();
  const locked = isOrderingLocked();

  const [breakfast, setBreakfast] = useState([]);
  const [lunch, setLunch] = useState(null);
  const [dinner, setDinner] = useState(null);
  const [breakfastTime, setBreakfastTime] = useState('');
  const [lunchTime, setLunchTime] = useState('');
  const [dinnerTime, setDinnerTime] = useState('');
  const [errors, setErrors] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = loadSubmissions();
    const all = stored || defaultSubmissions;
    const existing = all[houseId];
    if (existing) {
      setBreakfast(existing.breakfast || []);
      setLunch(existing.lunch || null);
      setDinner(existing.dinner || null);
      setBreakfastTime(existing.breakfastTime || '');
      setLunchTime(existing.lunchTime || '');
      setDinnerTime(existing.dinnerTime || '');
      setSaved(true);
    }
  }, [houseId]);

  function handleSubmit() {
    const validationErrors = validateSelections(breakfast, lunch, dinner, breakfastTime, lunchTime, dinnerTime);
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
      breakfastTime,
      lunchTime,
      dinnerTime,
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
      <div className="delivery-time">
        <label htmlFor="breakfast-time">Breakfast delivery time</label>
        <select
          id="breakfast-time"
          value={breakfastTime}
          onChange={(e) => setBreakfastTime(e.target.value)}
          disabled={locked}
        >
          <option value="">Select a time</option>
          {TIME_OPTIONS.breakfast.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <SelectionSection
        title="Lunch"
        options={lunchDinnerOptions}
        selected={lunch}
        onChange={setLunch}
        maxSelections={1}
        disabled={locked}
      />
      <div className="delivery-time">
        <label htmlFor="lunch-time">Lunch delivery time</label>
        <select
          id="lunch-time"
          value={lunchTime}
          onChange={(e) => setLunchTime(e.target.value)}
          disabled={locked}
        >
          <option value="">Select a time</option>
          {TIME_OPTIONS.lunch.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <SelectionSection
        title="Dinner"
        options={lunchDinnerOptions}
        selected={dinner}
        onChange={setDinner}
        maxSelections={1}
        disabled={locked}
      />
      <div className="delivery-time">
        <label htmlFor="dinner-time">Dinner delivery time</label>
        <select
          id="dinner-time"
          value={dinnerTime}
          onChange={(e) => setDinnerTime(e.target.value)}
          disabled={locked}
        >
          <option value="">Select a time</option>
          {TIME_OPTIONS.dinner.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

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
