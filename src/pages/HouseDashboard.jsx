import { useState, useEffect } from 'react';
import { isOrderingLocked } from '../utils/cutoff';
import { validateSelections } from '../utils/validation';
import { BREAKFAST_NOTE } from '../data/menuOptions';
import { loadSubmission, saveSubmission, loadMenuItems } from '../utils/storage';
import { getCurrentUser } from '../utils/auth';
import StatusBanner from '../components/StatusBanner';
import SelectionSection from '../components/SelectionSection';

const TIME_OPTIONS = {
  breakfast: ['7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'],
  lunch: ['11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM'],
  dinner: ['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM'],
};

export default function HouseDashboard() {
  const locked = isOrderingLocked();

  const [user, setUser] = useState(null);
  const [breakfastOptions, setBreakfastOptions] = useState([]);
  const [lunchDinnerOptions, setLunchDinnerOptions] = useState([]);
  const [breakfast, setBreakfast] = useState([]);
  const [lunch, setLunch] = useState(null);
  const [dinner, setDinner] = useState(null);
  const [breakfastTime, setBreakfastTime] = useState('');
  const [lunchTime, setLunchTime] = useState('');
  const [dinnerTime, setDinnerTime] = useState('');
  const [dailyHeadcount, setDailyHeadcount] = useState('');
  const [errors, setErrors] = useState([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [currentUser, menuItems] = await Promise.all([
          getCurrentUser(),
          loadMenuItems(),
        ]);
        if (!currentUser) return;
        setUser(currentUser);
        setDailyHeadcount(String(currentUser.headcount || ''));
        setBreakfastOptions(menuItems.filter((i) => i.category === 'breakfast'));
        setLunchDinnerOptions(menuItems.filter((i) => i.category === 'lunch_dinner'));

        const existing = await loadSubmission(currentUser.id);
        if (existing) {
          setBreakfast(existing.breakfast || []);
          setLunch(existing.lunch || null);
          setDinner(existing.dinner || null);
          setBreakfastTime(existing.breakfast_time || '');
          setLunchTime(existing.lunch_time || '');
          setDinnerTime(existing.dinner_time || '');
          if (existing.daily_headcount) {
            setDailyHeadcount(String(existing.daily_headcount));
          }
          setSaved(true);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setLoadError('Failed to load your dashboard. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSubmit() {
    const validationErrors = validateSelections(breakfast, lunch, dinner, breakfastTime, lunchTime, dinnerTime);
    if (!dailyHeadcount || parseInt(dailyHeadcount, 10) < 1) {
      validationErrors.push('Please enter how many people are eating today.');
    }
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setSaved(false);
      return;
    }

    setErrors([]);

    try {
      await saveSubmission(user.id, {
        breakfast,
        lunch,
        dinner,
        breakfastTime,
        lunchTime,
        dinnerTime,
        dailyHeadcount: parseInt(dailyHeadcount, 10),
      });
      setSaved(true);
    } catch (err) {
      setErrors([err.message || 'Failed to save. Please try again.']);
    }
  }


  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateString = tomorrow.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  if (loading) {
    return <div className="page house-dashboard"><p>Loading...</p></div>;
  }

  if (loadError) {
    return <div className="page house-dashboard"><p className="form-error">{loadError}</p></div>;
  }

  return (
    <div className="page house-dashboard">
      <div className="dashboard-header">
        <h1>{user?.houseName || 'Dashboard'}</h1>
        <h2>Next Day Meal Selection</h2>
        <p className="dashboard-date">{dateString}</p>
      </div>

      <StatusBanner />

      <div className="headcount-section">
        <label htmlFor="daily-headcount">People eating tomorrow</label>
        <div className="headcount-input-row">
          <input
            id="daily-headcount"
            type="number"
            min="1"
            value={dailyHeadcount}
            onChange={(e) => setDailyHeadcount(e.target.value)}
            disabled={locked}
          />
          <span className="headcount-note">
            Meal plan total: {user?.headcount || 0}
          </span>
        </div>
      </div>

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
