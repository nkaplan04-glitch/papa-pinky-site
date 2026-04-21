import { getPlan } from './mealPlans';

export function validateSelections(planId, { lunch, dinner, lunchTime, dinnerTime }) {
  const errors = [];
  const plan = getPlan(planId);
  const allowed = plan.meals;

  if (plan.type === 'block') {
    const hasLunch = allowed.includes('lunch') && lunch;
    const hasDinner = allowed.includes('dinner') && dinner;

    if (!hasLunch && !hasDinner) {
      errors.push('Please select at least one meal.');
    }

    if (hasLunch && !lunchTime) {
      errors.push('Please select a delivery time for lunch.');
    }
    if (hasDinner && !dinnerTime) {
      errors.push('Please select a delivery time for dinner.');
    }
  } else {
    if (allowed.includes('lunch')) {
      if (!lunch) {
        errors.push('Please select 1 lunch item.');
      }
      if (!lunchTime) {
        errors.push('Please select a delivery time for lunch.');
      }
    }
    if (allowed.includes('dinner')) {
      if (!dinner) {
        errors.push('Please select 1 dinner item.');
      }
      if (!dinnerTime) {
        errors.push('Please select a delivery time for dinner.');
      }
    }
  }

  return errors;
}
