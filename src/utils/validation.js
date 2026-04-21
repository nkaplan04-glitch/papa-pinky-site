import { getPlan } from './mealPlans';

export function validateSelections(planId, { breakfast, lunch, dinner, breakfastTime, lunchTime, dinnerTime }) {
  const errors = [];
  const plan = getPlan(planId);
  const allowed = plan.meals;

  if (plan.type === 'block') {
    const hasBreakfast = allowed.includes('breakfast') && breakfast && breakfast.length > 0;
    const hasLunch = allowed.includes('lunch') && lunch;
    const hasDinner = allowed.includes('dinner') && dinner;

    if (!hasBreakfast && !hasLunch && !hasDinner) {
      errors.push('Please select at least one meal.');
    }

    if (hasBreakfast && breakfast.length > 2) {
      errors.push('Please select no more than 2 breakfast items.');
    }
    if (hasBreakfast && !breakfastTime) {
      errors.push('Please select a delivery time for breakfast.');
    }
    if (hasLunch && !lunchTime) {
      errors.push('Please select a delivery time for lunch.');
    }
    if (hasDinner && !dinnerTime) {
      errors.push('Please select a delivery time for dinner.');
    }
  } else {
    if (allowed.includes('breakfast')) {
      if (!breakfast || breakfast.length !== 2) {
        errors.push('Please select exactly 2 breakfast items.');
      }
      if (!breakfastTime) {
        errors.push('Please select a delivery time for breakfast.');
      }
    }
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
