// Streak, XP and levels. Pure functions over a plain state object (persisted by storage.js).
import { dayKey, addDays } from './dates.js';

export const XP_KNOWN = 10;
export const XP_KNOWN_AFTER_RETRY = 5;
export const XP_AGAIN = 2;

export const LEVELS = [
  { min: 0, name: 'دبدوب صغير' },
  { min: 60, name: 'مستكشف' },
  { min: 180, name: 'متكلّم مبتدئ' },
  { min: 400, name: 'جار لطيف' },
  { min: 750, name: 'واثق من نفسه' },
  { min: 1200, name: 'شبه روماني' },
  { min: 2000, name: 'أستاذ الكلمات' },
];

export function levelInfo(xp) {
  let i = 0;
  while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1].min) i++;
  const cur = LEVELS[i];
  const next = LEVELS[i + 1];
  const progress = next ? (xp - cur.min) / (next.min - cur.min) : 1;
  return { level: i + 1, name: cur.name, next, progress, toNext: next ? next.min - xp : 0 };
}

/** Record activity today: continues the streak if the last active day was yesterday. */
export function touchStreak(state, today = dayKey()) {
  if (state.lastActive === today) return state;
  const streak = state.lastActive === addDays(today, -1) ? state.streak + 1 : 1;
  return { ...state, streak, bestStreak: Math.max(state.bestStreak ?? 0, streak), lastActive: today };
}

/** Streak as shown to the user: still alive if they practised today or yesterday. */
export function currentStreak(state, today = dayKey()) {
  if (!state.lastActive) return 0;
  return state.lastActive === today || state.lastActive === addDays(today, -1) ? state.streak : 0;
}

export const practisedToday = (state, today = dayKey()) => state.lastActive === today;
