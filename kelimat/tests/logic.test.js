import { test } from 'node:test';
import assert from 'node:assert/strict';
import { review, buildQueue, requeue, INTERVAL_DAYS, RETRY_GAP } from '../src/lib/srs.js';
import { touchStreak, currentStreak, levelInfo, LEVELS } from '../src/lib/progress.js';
import { startOfDay, addDays } from '../src/lib/dates.js';

const DAY = 86400000;
const now = new Date(2026, 10, 20, 15, 0).getTime();

test('known moves up a box and schedules at local midnight', () => {
  const c1 = review(undefined, true, now);
  assert.equal(c1.box, 1);
  assert.equal(c1.due, startOfDay(now, INTERVAL_DAYS[1]));
  const c2 = review(c1, true, now + DAY);
  assert.equal(c2.box, 2);
  assert.ok(c2.due - (now + DAY) > 2 * DAY);
});

test('wrong answer resets to box 0 and is due almost immediately', () => {
  const strong = { box: 4, due: 0, reps: 5, lapses: 0, last: 0 };
  const c = review(strong, false, now);
  assert.equal(c.box, 0);
  assert.equal(c.lapses, 1);
  assert.ok(c.due - now <= 60 * 1000);
});

test('box is capped', () => {
  let c;
  for (let i = 0; i < 20; i++) c = review(c, true, now);
  assert.equal(c.box, INTERVAL_DAYS.length - 1);
});

test('queue puts due cards before new ones and respects limits', () => {
  const items = Array.from({ length: 20 }, (_, i) => ({ id: `i${i}` }));
  const cards = { i5: { box: 2, due: now - 1, last: 0 }, i6: { box: 0, due: now - 1, last: 0 }, i7: { box: 1, due: now + DAY, last: 0 } };
  const { queue, extra } = buildQueue(items, cards, { now, limit: 5, newLimit: 3 });
  assert.equal(extra, false);
  assert.deepEqual(queue.map((x) => x.id), ['i6', 'i5', 'i0', 'i1', 'i2']);
});

test('queue falls back to weakest cards when nothing is due', () => {
  const items = [{ id: 'a' }, { id: 'b' }];
  const cards = { a: { box: 3, due: now + DAY, last: 1 }, b: { box: 1, due: now + DAY, last: 1 } };
  const { queue, extra } = buildQueue(items, cards, { now });
  assert.equal(extra, true);
  assert.equal(queue[0].id, 'b');
});

test('requeue reinserts the missed card a few positions later', () => {
  const q = ['a', 'b', 'c', 'd', 'e', 'f'];
  assert.deepEqual(requeue(q, 0), ['a', 'b', 'c', 'd', 'a', 'e', 'f']);
  assert.equal(requeue(q, 0).indexOf('a', 1), 1 + RETRY_GAP);
  assert.deepEqual(requeue(['a', 'b'], 1), ['a', 'b', 'b']);
});

test('streak continues on consecutive days and resets after a gap', () => {
  const t = '2026-11-20';
  let s = { streak: 0, bestStreak: 0, lastActive: null };
  s = touchStreak(s, t);
  assert.equal(s.streak, 1);
  assert.equal(touchStreak(s, t), s); // same day, no change
  s = touchStreak(s, addDays(t, 1));
  assert.equal(s.streak, 2);
  assert.equal(currentStreak(s, addDays(t, 2)), 2); // yesterday counts
  assert.equal(currentStreak(s, addDays(t, 3)), 0); // broken
  s = touchStreak(s, addDays(t, 5));
  assert.equal(s.streak, 1);
  assert.equal(s.bestStreak, 2);
});

test('month boundaries in addDays', () => {
  assert.equal(addDays('2026-11-30', 1), '2026-12-01');
  assert.equal(addDays('2026-01-01', -1), '2025-12-31');
});

test('levels', () => {
  assert.equal(levelInfo(0).level, 1);
  assert.equal(levelInfo(LEVELS[1].min).level, 2);
  assert.equal(levelInfo(99999).next, undefined);
  assert.equal(levelInfo(99999).progress, 1);
});
