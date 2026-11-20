// All "days" are local calendar days, keyed as YYYY-MM-DD.
const pad = (n) => String(n).padStart(2, '0');

export function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function addDays(key, n) {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d + n));
}

/** Local midnight (ms) of the day `n` days after `now`. */
export function startOfDay(now = Date.now(), n = 0) {
  const d = new Date(now);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n).getTime();
}

/** Whole days since a fixed local epoch — stable across a day, used to pick the daily word. */
export function dayNumber(date = new Date()) {
  return Math.round(startOfDay(date.getTime()) / 86400000 - new Date(2024, 0, 1).getTime() / 86400000);
}
