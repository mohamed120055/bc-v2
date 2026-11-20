import data from '../data/scenarios.json';
import { dayNumber } from './dates.js';

export const scenarios = data.scenarios;
export const allItems = scenarios.flatMap((s) => s.items.map((it) => ({ ...it, scenarioId: s.id })));
export const scenarioById = Object.fromEntries(scenarios.map((s) => [s.id, s]));

/** Same word all day; steps by 37 (coprime with 90) so consecutive days jump between scenarios. */
export function dailyItem(date = new Date()) {
  const n = allItems.length;
  const i = (((dayNumber(date) * 37) % n) + n) % n;
  return allItems[i];
}
