// Cutoff configuration
// Set DEMO_MODE to 'open' | 'locked' | 'auto'
// 'open'   — ordering always open (for demos)
// 'locked' — ordering always locked (for demos)
// 'auto'   — use real clock, locks at 3:30 AM
const DEMO_MODE = 'auto';
const CUTOFF_HOUR = 3;
const CUTOFF_MINUTE = 30;

export function isOrderingLocked() {
  if (DEMO_MODE === 'open') return false;
  if (DEMO_MODE === 'locked') return true;

  const now = new Date();
  const totalMinutes = now.getHours() * 60 + now.getMinutes();
  const cutoffMinutes = CUTOFF_HOUR * 60 + CUTOFF_MINUTE;
  return totalMinutes >= cutoffMinutes;
}

export function getCutoffTimeString() {
  return '3:30 AM';
}

export function getDemoMode() {
  return DEMO_MODE;
}
