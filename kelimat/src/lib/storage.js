const KEY = 'kelimat:v1';

export const defaultState = () => ({
  cards: {},        // itemId -> { box, due, reps, lapses, last }
  xp: 0,
  streak: 0,
  bestStreak: 0,
  lastActive: null, // YYYY-MM-DD
  reviews: 0,
  mode: 'beginner', // 'beginner' | 'intermediate' | 'advanced' — switched from the tabs at the top
});

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const saved = JSON.parse(raw);
    return { ...defaultState(), ...saved, mode: saved.mode || 'beginner' };
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
