// Tag codes used across menu items
// V = Vegetarian, VG = Vegan, K = Kosher-friendly
// D = Dairy, G = Gluten, N = Nuts, E = Eggs, F = Fish/Seafood, S = Soy
export const TAG_LEGEND = {
  V:  { label: 'Vegetarian', short: 'V' },
  VG: { label: 'Vegan', short: 'VG' },
  K:  { label: 'Kosher-Friendly', short: 'K' },
  D:  { label: 'Contains Dairy', short: 'D' },
  G:  { label: 'Contains Gluten', short: 'G' },
  N:  { label: 'Contains Nuts', short: 'N' },
  E:  { label: 'Contains Eggs', short: 'E' },
  F:  { label: 'Contains Fish/Seafood', short: 'F' },
  S:  { label: 'Contains Soy', short: 'S' },
};

export const breakfastOptions = [
  { name: 'Breakfast quesadillas with eggs, turkey sausage and shredded cheddar cheese', tags: ['G', 'E', 'D'] },
  { name: 'French toast with fresh strawberries and blueberries, syrup, scrambled eggs with turkey sausage patties', tags: ['G', 'E', 'D'] },
  { name: 'Sausage/Bacon egg and cheese on a toasted bagel', tags: ['G', 'E', 'D'] },
  { name: 'Breakfast with scrambled eggs, bacon, sausage and protein pancakes served with ketchup, syrup and butter', tags: ['G', 'E', 'D'] },
  { name: 'Chicken and waffles served with syrup', tags: ['G', 'E', 'D'] },
  { name: 'Bagel with lox and cream cheese', tags: ['G', 'F', 'D'] },
];

export const lunchDinnerOptions = [
  { name: 'Chicken turkey bacon ranch wrap with lettuce, tomatoes and shredded mozzarella', tags: ['G', 'D'] },
  { name: 'Chicken or beef quesadillas with shredded cheese, sour cream, salsa and guacamole', tags: ['G', 'D'] },
  { name: 'Turkey avocado club with ham, lettuce, tomatoes, bacon and mayo on Texas toast', tags: ['G', 'E', 'D'] },
  { name: 'Chicken and lamb gyros with lettuce, tomatoes and tzatziki on warm pita', tags: ['G', 'D'] },
  { name: 'Chicken and beef tacos with corn/flour tortillas, lettuce, tomatoes, salsa and guac', tags: ['G'] },
  { name: 'Chicken fried rice with peas, carrots and eggs', tags: ['E', 'S'] },
  { name: 'Double smash burger with onions, lettuce, tomatoes, pickles and ketchup on brioche', tags: ['G', 'E', 'D'] },
  { name: 'Chicken Caesar wrap or salad', tags: ['G', 'D', 'E'] },
  { name: 'Turkey BLT on Texas toast with cheddar and mayo', tags: ['G', 'D', 'E'] },
  { name: 'Chicken cutlet panini on ciabatta with mozzarella, lettuce and tomatoes and a side of chipotle mayo or ranch dressing', tags: ['G', 'D', 'E'] },
  { name: 'Chicken penne alla vodka with fresh herbs and Parmesan cheese', tags: ['G', 'D'] },
  { name: 'Vegetable fried rice with scrambled eggs and crispy tofu', tags: ['V', 'E', 'S'] },
  { name: 'Chicken pesto pasta with balsamic glaze', tags: ['G', 'N', 'D'] },
  { name: 'Caprese panini on sourdough with mozzarella, fresh basil, tomato and balsamic glaze pressed warm', tags: ['V', 'K', 'G', 'D'] },
  { name: 'Tuna poke bowl with rice, avocado, cucumber and poke sauce', tags: ['F', 'S'] },
  { name: 'Grilled chicken, rice and avocado burrito, panini pressed with your choice of cheese and spicy mayo', tags: ['G', 'D', 'E'] },
  { name: 'Chicken teriyaki with broccoli and rice', tags: ['S'] },
  { name: 'Cobb salad with chicken, bacon, avocado, cucumber, tomatoes and shredded cheddar, side of ranch or balsamic dressing', tags: ['D', 'E'] },
  { name: 'Chicken Parmesan over pasta', tags: ['G', 'D', 'E'] },
  { name: 'Chicken tikka masala with homemade naan bread served with rice and fresh cilantro', tags: ['G', 'D'] },
  { name: 'Chicken marsala with mashed potatoes and mixed vegetable medley', tags: ['D'] },
  { name: 'Hibachi chicken with rice and vegetables', tags: ['S'] },
  { name: 'Loaded nachos with guacamole, salsa and sour cream', tags: ['V', 'K', 'G', 'D'] },
  { name: 'Chopped cheese with lettuce and tomatoes, ketchup and mayo on the side', tags: ['G', 'D'] },
];

export const BREAKFAST_NOTE = 'All breakfast options come with fruit and orange juice.';
