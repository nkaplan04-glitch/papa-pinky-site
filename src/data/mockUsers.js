// Mock credentials for V1 demo.
// Replace with Supabase auth when ready.
export const mockUsers = [
  { username: 'sigchi', password: 'sigchi2026', role: 'house', houseId: 'sigchi', houseName: 'Sigma Chi' },
  { username: 'pike', password: 'pike2026', role: 'house', houseId: 'pike', houseName: 'Pike' },
  { username: 'dtd', password: 'dtd2026', role: 'house', houseId: 'dtd', houseName: 'Delta Tau Delta' },
  { username: 'aepi', password: 'aepi2026', role: 'house', houseId: 'aepi', houseName: 'AEPi' },
  { username: 'chef', password: 'chefadmin', role: 'chef', houseId: null, houseName: null },
];

export const houses = [
  { id: 'sigchi', name: 'Sigma Chi' },
  { id: 'pike', name: 'Pike' },
  { id: 'dtd', name: 'Delta Tau Delta' },
  { id: 'aepi', name: 'AEPi' },
];
