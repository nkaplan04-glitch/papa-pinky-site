export const PLANS = {
  ld_semester: {
    id: 'ld_semester',
    label: 'Lunch & Dinner (Semester)',
    shortLabel: 'LD Semester',
    meals: ['lunch', 'dinner'],
    cap: null,
    type: 'semester',
  },
  d_semester: {
    id: 'd_semester',
    label: 'Dinner Only (Semester)',
    shortLabel: 'Dinner Semester',
    meals: ['dinner'],
    cap: null,
    type: 'semester',
  },
  block_55: {
    id: 'block_55',
    label: '55 Meal Block',
    shortLabel: '55 Block',
    meals: ['lunch', 'dinner'],
    cap: 55,
    type: 'block',
  },
};

export const DEFAULT_PLAN = 'ld_semester';

export function getPlan(planId) {
  return PLANS[planId] || PLANS[DEFAULT_PLAN];
}

export function isMealAllowed(planId, meal) {
  return getPlan(planId).meals.includes(meal);
}

export function isBlockPlan(planId) {
  return getPlan(planId).type === 'block';
}

export function getMealCap(planId) {
  return getPlan(planId).cap;
}

// Counts the number of meal slots in a saved/in-progress submission.
// Each filled meal type (lunch chosen, dinner chosen) counts as 1.
export function countMealsInSubmission(submission) {
  if (!submission) return 0;
  let count = 0;
  if (submission.lunch) count += 1;
  if (submission.dinner) count += 1;
  return count;
}
