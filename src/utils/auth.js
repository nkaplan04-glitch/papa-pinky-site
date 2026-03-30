// Mock auth layer — swap with Supabase auth calls later.
import { mockUsers } from '../data/mockUsers';
import { saveSession, loadSession, clearSession } from './storage';

export function login(username, password) {
  const user = mockUsers.find(
    (u) => u.username === username.toLowerCase().trim() && u.password === password
  );
  if (!user) return null;

  const session = {
    username: user.username,
    role: user.role,
    houseId: user.houseId,
    houseName: user.houseName,
  };
  saveSession(session);
  return session;
}

export function logout() {
  clearSession();
}

export function getCurrentUser() {
  return loadSession();
}
