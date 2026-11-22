import data from '../data/scenarios.json';
import { dayNumber } from './dates.js';

/** The three learning modes. Each item in scenarios.json has `level` set to one of these ids. */
export const MODES = [
  {
    id: 'beginner', name: 'مبتدئ', icon: '🌱',
    desc: 'كلمات أساسية وعبارات قصيرة. النطق بالعربي ظاهر على طول.',
    session: { limit: 8, newLimit: 5 }, pronOnFront: true, reverse: false,
  },
  {
    id: 'intermediate', name: 'متوسط', icon: '🌿',
    desc: 'عبارات للمواقف اليومية. النطق يظهر لما تقلب البطاقة.',
    session: { limit: 15, newLimit: 8 }, pronOnFront: false, reverse: false,
  },
  {
    id: 'advanced', name: 'متقدم', icon: '🌳',
    desc: 'جمل كاملة. تشوف المعنى بالعربي وتحاول تقولها بالروماني.',
    session: { limit: 20, newLimit: 10 }, pronOnFront: false, reverse: true,
  },
];
export const modeById = Object.fromEntries(MODES.map((m) => [m.id, m]));
export const getMode = (id) => modeById[id] ?? MODES[0];

export const scenarios = data.scenarios;
export const allItems = scenarios.flatMap((s) => s.items.map((it) => ({ ...it, scenarioId: s.id })));
export const scenarioById = Object.fromEntries(scenarios.map((s) => [s.id, s]));

export const itemsForMode = (mode) => allItems.filter((it) => it.level === mode);
export const scenarioItems = (scenarioId, mode) => allItems.filter((it) => it.scenarioId === scenarioId && it.level === mode);

/** Same item all day; steps by a prime so consecutive days jump between scenarios. */
export function dailyItem(mode, date = new Date()) {
  const pool = itemsForMode(mode);
  const n = pool.length;
  const i = (((dayNumber(date) * 37) % n) + n) % n;
  return pool[i];
}
