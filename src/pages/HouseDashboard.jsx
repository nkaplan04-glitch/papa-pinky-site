import { useState, useEffect, useRef, useMemo } from 'react';
import { validateSelections } from '../utils/validation';
import { loadSubmission, saveSubmission, loadSubmissionsForMonth, loadMenuItems, loadHouseSubmissions } from '../utils/storage';
import { getCurrentUser } from '../utils/auth';
import { toDateString, isSameDay } from '../utils/dates';
import { getPlan, isBlockPlan, countMealsInSubmission } from '../utils/mealPlans';
import SelectionSection from '../components/SelectionSection';

const TIME_OPTIONS = {
  breakfast: ['7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'],
  lunch: ['11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM'],
  dinner: ['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM'],
};

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function HouseDashboard() {
  const [user, setUser] = useState(null);
  const [breakfastOptions, setBreakfastOptions] = useState([]);
  const [lunchDinnerOptions, setLunchDinnerOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Block plan tracking
  const [totalUsed, setTotalUsed] = useState(0);
  // Cached count for the currently-edited day (so we can compute net change)
  const [originalDayCount, setOriginalDayCount] = useState(0);

  // Calendar
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [submittedDates, setSubmittedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const selectionTokenRef = useRef(0);

  // Order form for selected day
  const [breakfast, setBreakfast] = useState([]);
  const [lunch, setLunch] = useState(null);
  const [dinner, setDinner] = useState(null);
  const [breakfastTime, setBreakfastTime] = useState('');
  const [lunchTime, setLunchTime] = useState('');
  const [dinnerTime, setDinnerTime] = useState('');
  const [dailyHeadcount, setDailyHeadcount] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState([]);
  const [saved, setSaved] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

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
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setLoadError('Failed to load your dashboard. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (user) {
      loadMonthSubmissions();
    }
  }, [user, viewYear, viewMonth]);

  useEffect(() => {
    if (user && isBlockPlan(user.mealPlan)) {
      loadTotalUsage();
    }
  }, [user]);

  async function loadMonthSubmissions() {
    try {
      const dates = await loadSubmissionsForMonth(user.id, viewYear, viewMonth);
      setSubmittedDates(dates);
    } catch (err) {
      console.error('Failed to load month submissions:', err);
    }
  }

  async function loadTotalUsage() {
    try {
      const subs = await loadHouseSubmissions(user.id);
      const total = subs.reduce((sum, s) => sum + countMealsInSubmission({
        breakfast: s.breakfast,
        lunch: s.lunch,
        dinner: s.dinner,
      }), 0);
      setTotalUsed(total);
    } catch (err) {
      console.error('Failed to load total usage:', err);
    }
  }

  async function handleSelectDate(date) {
    const token = ++selectionTokenRef.current;
    setSelectedDate(date);
    setErrors([]);
    setSaved(false);
    setOrderLoading(true);

    try {
      const existing = await loadSubmission(user.id, date);
      if (token !== selectionTokenRef.current) return;
      if (existing) {
        setBreakfast(existing.breakfast || []);
        setLunch(existing.lunch || null);
        setDinner(existing.dinner || null);
        setBreakfastTime(existing.breakfast_time || '');
        setLunchTime(existing.lunch_time || '');
        setDinnerTime(existing.dinner_time || '');
        if (existing.daily_headcount) {
          setDailyHeadcount(String(existing.daily_headcount));
        } else {
          setDailyHeadcount(String(user.headcount || ''));
        }
        setNotes(existing.notes || '');
        setSaved(true);
        setOriginalDayCount(countMealsInSubmission({
          breakfast: existing.breakfast,
          lunch: existing.lunch,
          dinner: existing.dinner,
        }));
      } else {
        setBreakfast([]);
        setLunch(null);
        setDinner(null);
        setBreakfastTime('');
        setLunchTime('');
        setDinnerTime('');
        setDailyHeadcount(String(user.headcount || ''));
        setNotes('');
        setSaved(false);
        setOriginalDayCount(0);
      }
    } catch (err) {
      console.error('Failed to load order:', err);
    } finally {
      if (token === selectionTokenRef.current) {
        setOrderLoading(false);
      }
    }
  }

  async function handleSubmit() {
    const validationErrors = validateSelections(user.mealPlan, {
      breakfast, lunch, dinner, breakfastTime, lunchTime, dinnerTime,
    });
    if (!dailyHeadcount || parseInt(dailyHeadcount, 10) < 1) {
      validationErrors.push('Please enter how many people are eating.');
    }

    // Block-plan cap enforcement
    if (isBlockPlan(user.mealPlan)) {
      const newDayCount = countMealsInSubmission({ breakfast, lunch, dinner });
      const projectedTotal = totalUsed - originalDayCount + newDayCount;
      const cap = plan.cap;
      if (projectedTotal > cap) {
        const remaining = Math.max(0, cap - (totalUsed - originalDayCount));
        validationErrors.push(
          `This order would exceed your ${cap}-meal plan. You have ${remaining} meal${remaining === 1 ? '' : 's'} left.`
        );
      }
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setSaved(false);
      return;
    }

    setErrors([]);

    try {
      await saveSubmission(user.id, selectedDate, {
        breakfast,
        lunch,
        dinner,
        breakfastTime,
        lunchTime,
        dinnerTime,
        dailyHeadcount: parseInt(dailyHeadcount, 10),
        notes: notes.trim(),
      });
      setSaved(true);
      const savedCount = countMealsInSubmission({ breakfast, lunch, dinner });
      setOriginalDayCount(savedCount);
      await loadMonthSubmissions();
      if (isBlockPlan(user.mealPlan)) await loadTotalUsage();
    } catch (err) {
      setErrors([err.message || 'Failed to save. Please try again.']);
    }
  }

  function handleCloseOrder() {
    setSelectedDate(null);
    setErrors([]);
  }

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const monthName = new Date(viewYear, viewMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(new Date(viewYear, viewMonth, d));
  }

  if (loading) {
    return <div className="page house-dashboard"><p>Loading...</p></div>;
  }

  if (loadError) {
    return <div className="page house-dashboard"><p className="form-error">{loadError}</p></div>;
  }

  const selectedDateStr = selectedDate
    ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : '';

  const plan = getPlan(user?.mealPlan);
  const showBreakfast = plan.meals.includes('breakfast');
  const showLunch = plan.meals.includes('lunch');
  const showDinner = plan.meals.includes('dinner');
  const isBlock = plan.type === 'block';
  const remainingMeals = isBlock ? Math.max(0, plan.cap - totalUsed) : null;
  const atLimit = isBlock && totalUsed >= plan.cap;

  return (
    <div className="page house-dashboard">
      <div className="dashboard-header">
        <h1>{user?.houseName || 'Dashboard'}</h1>
        <h2>Meal Ordering</h2>
        <p className="headcount-note" style={{ marginTop: '4px' }}>
          {plan.label} · {user?.headcount || 0} people on plan
        </p>
        {isBlock && (
          <div className={`meal-tracker-banner ${atLimit ? 'meal-tracker-full' : remainingMeals <= 5 ? 'meal-tracker-low' : ''}`}>
            <div className="meal-tracker-bar-wrap">
              <div className="meal-tracker-bar" style={{ width: `${Math.min(100, (totalUsed / plan.cap) * 100)}%` }} />
            </div>
            <div className="meal-tracker-text">
              <strong>{totalUsed}</strong> of <strong>{plan.cap}</strong> meals used
              <span className="meal-tracker-remaining"> · {remainingMeals} left</span>
            </div>
          </div>
        )}
      </div>

      {/* Calendar */}
      <div className="order-calendar">
        <div className="calendar-nav">
          <button className="btn btn-secondary" onClick={prevMonth}>&larr;</button>
          <h3 className="calendar-month">{monthName}</h3>
          <button className="btn btn-secondary" onClick={nextMonth}>&rarr;</button>
        </div>
        <div className="calendar-grid">
          {DAY_LABELS.map((d) => (
            <div key={d} className="calendar-day-label">{d}</div>
          ))}
          {calendarCells.map((date, i) => {
            if (!date) return <div key={`empty-${i}`} className="calendar-cell empty" />;
            const dateStr = toDateString(date);
            const isToday = isSameDay(date, today);
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const hasOrder = submittedDates.includes(dateStr);

            return (
              <button
                key={dateStr}
                className={`calendar-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasOrder ? 'has-order' : ''}`}
                onClick={() => handleSelectDate(date)}
              >
                <span className="calendar-day-num">{date.getDate()}</span>
                {hasOrder && <span className="calendar-dot" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Order form for selected day */}
      {selectedDate && (
        <div className="day-order-form">
          <div className="day-order-header">
            <h3>{selectedDateStr}</h3>
            <button className="btn btn-secondary" onClick={handleCloseOrder}>Close</button>
          </div>

          {orderLoading ? (
            <p>Loading order...</p>
          ) : (
            <>
              <div className="headcount-section">
                <label htmlFor="daily-headcount">People eating</label>
                <div className="headcount-input-row">
                  <input
                    id="daily-headcount"
                    type="number"
                    min="1"
                    value={dailyHeadcount}
                    onChange={(e) => setDailyHeadcount(e.target.value)}
                  />
                </div>
              </div>

              {showBreakfast && (
                <>
                  <SelectionSection
                    title={isBlock ? 'Breakfast (optional)' : 'Breakfast'}
                    options={breakfastOptions}
                    selected={breakfast}
                    onChange={setBreakfast}
                    maxSelections={2}
                  />
                  <div className="delivery-time">
                    <label htmlFor="breakfast-time">Breakfast delivery time</label>
                    <select
                      id="breakfast-time"
                      value={breakfastTime}
                      onChange={(e) => setBreakfastTime(e.target.value)}
                    >
                      <option value="">Select a time</option>
                      {TIME_OPTIONS.breakfast.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {showLunch && (
                <>
                  <SelectionSection
                    title={isBlock ? 'Lunch (optional)' : 'Lunch'}
                    options={lunchDinnerOptions}
                    selected={lunch}
                    onChange={setLunch}
                    maxSelections={1}
                  />
                  <div className="delivery-time">
                    <label htmlFor="lunch-time">Lunch delivery time</label>
                    <select
                      id="lunch-time"
                      value={lunchTime}
                      onChange={(e) => setLunchTime(e.target.value)}
                    >
                      <option value="">Select a time</option>
                      {TIME_OPTIONS.lunch.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {showDinner && (
                <>
                  <SelectionSection
                    title={isBlock ? 'Dinner (optional)' : 'Dinner'}
                    options={lunchDinnerOptions}
                    selected={dinner}
                    onChange={setDinner}
                    maxSelections={1}
                  />
                  <div className="delivery-time">
                    <label htmlFor="dinner-time">Dinner delivery time</label>
                    <select
                      id="dinner-time"
                      value={dinnerTime}
                      onChange={(e) => setDinnerTime(e.target.value)}
                    >
                      <option value="">Select a time</option>
                      {TIME_OPTIONS.dinner.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="notes-section">
                <label htmlFor="order-notes">Notes for Chef Roger</label>
                <textarea
                  id="order-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder='e.g. "Use the side door for delivery", "No beans in the burrito", etc.'
                  rows={3}
                />
              </div>

              {errors.length > 0 && (
                <div className="validation-errors">
                  {errors.map((err) => (
                    <p key={err}>{err}</p>
                  ))}
                </div>
              )}

              <button onClick={handleSubmit} className="btn btn-primary btn-full submit-btn">
                {saved ? 'Update Order' : 'Submit Order'}
              </button>

              {saved && <p className="saved-message">Order saved for {selectedDateStr}.</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
}
