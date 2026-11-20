// Leitner-style spaced repetition.
// box 0 = new / forgotten. "عارفها" moves a card up one box; "لسه" sends it back to box 0.
// A card in box b is due again INTERVAL_DAYS[b] days later (at local midnight).
import { startOfDay } from './dates.js';

export const INTERVAL_DAYS = [0, 1, 3, 7, 14, 30];
export const MAX_BOX = INTERVAL_DAYS.length - 1;
/** How many cards later a "لسه" card reappears in the same session. */
export const RETRY_GAP = 3;
const RETRY_DELAY_MS = 60 * 1000;

export function newCard() {
  return { box: 0, due: 0, reps: 0, lapses: 0, last: 0 };
}

export function review(card, known, now = Date.now()) {
  const c = card ?? newCard();
  if (known) {
    const box = Math.min(c.box + 1, MAX_BOX);
    return { ...c, box, due: startOfDay(now, INTERVAL_DAYS[box]), reps: c.reps + 1, last: now };
  }
  return { ...c, box: 0, due: now + RETRY_DELAY_MS, reps: c.reps + 1, lapses: c.lapses + 1, last: now };
}

export const isDue = (card, now = Date.now()) => !!card && card.due <= now;

/**
 * Build a session queue: due cards first (most overdue, then lowest box), then new cards.
 * If nothing is due or new, returns the weakest cards so the user can still practise.
 */
export function buildQueue(items, cards, { now = Date.now(), limit = 15, newLimit = 8 } = {}) {
  const due = items
    .filter((it) => isDue(cards[it.id], now))
    .sort((a, b) => cards[a.id].box - cards[b.id].box || cards[a.id].due - cards[b.id].due);
  const fresh = items.filter((it) => !cards[it.id]).slice(0, newLimit);
  const queue = [...due, ...fresh].slice(0, limit);
  if (queue.length) return { queue, extra: false };
  const weakest = [...items].sort((a, b) => cards[a.id].box - cards[b.id].box || cards[a.id].last - cards[b.id].last);
  return { queue: weakest.slice(0, Math.min(limit, 10)), extra: true };
}

/** Re-insert a missed card RETRY_GAP positions after the current one. */
export function requeue(queue, index) {
  const next = queue.slice();
  next.splice(Math.min(index + 1 + RETRY_GAP, next.length), 0, queue[index]);
  return next;
}

export function countDue(items, cards, now = Date.now()) {
  return items.filter((it) => isDue(cards[it.id], now)).length;
}

export const isLearned = (card) => !!card && card.box >= 1;
