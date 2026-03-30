export function validateSelections(breakfast, lunch, dinner) {
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

  return errors;
}
