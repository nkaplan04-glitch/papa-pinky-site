// Seed data so the app doesn't look empty on first load.
// Replace with Supabase reads/writes when ready.

const now = new Date().toISOString();

export const defaultSubmissions = {
  sigchi: {
    breakfast: [
      'Chicken and waffles served with syrup',
      'Sausage/Bacon egg and cheese on a toasted bagel',
    ],
    lunch: 'Chicken fried rice with peas, carrots and eggs',
    dinner: 'Chicken Parmesan over pasta',
    breakfastTime: '9:00 AM',
    lunchTime: '12:30 PM',
    dinnerTime: '6:30 PM',
    submittedAt: now,
  },
  pike: {
    breakfast: [
      'French toast with fresh strawberries and blueberries, syrup, scrambled eggs with turkey sausage patties',
      'Bagel with lox and cream cheese',
    ],
    lunch: 'Double smash burger with onions, lettuce, tomatoes, pickles and ketchup on brioche',
    dinner: 'Chicken tikka masala with homemade naan bread served with rice and fresh cilantro',
    breakfastTime: '8:30 AM',
    lunchTime: '12:00 PM',
    dinnerTime: '6:00 PM',
    submittedAt: now,
  },
  // DTD and AEPi intentionally left empty so chef dashboard shows "not submitted" states
};
