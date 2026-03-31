export function validateSelections(breakfast, lunch, dinner, breakfastTime, lunchTime, dinnerTime) {
  const errors = [];

  if (!breakfast || breakfast.length !== 2) {
    errors.push('Please select exactly 2 breakfast items.');
  }
  if (!lunch) {
    errors.push('Please select 1 lunch item.');
  }
  if (!dinner) {
    errors.push('Please select 1 dinner item.');
  }
  if (!breakfastTime) {
    errors.push('Please select a delivery time for breakfast.');
  }
  if (!lunchTime) {
    errors.push('Please select a delivery time for lunch.');
  }
  if (!dinnerTime) {
    errors.push('Please select a delivery time for dinner.');
  }

  return errors;
}
