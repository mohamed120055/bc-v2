const KEY = 'kelimat:v1';

export const defaultState = () => ({
  cards: {},        // itemId -> { box, due, reps, lapses, last }
  xp: 0,
  streak: 0,
  bestStreak: 0,
  lastActive: null, // YYYY-MM-DD
  reviews: 0,
  mode: null,       // 'beginner' | 'intermediate' | 'advanced' — chosen on first launch
});

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaultState(), ...JSON.parse(raw) } : defaultState();
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full or blocked (private mode) — progress stays in memory */
  }
}

export function clearState() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}
