import { scenarios, scenarioItems } from '../lib/content.js';
import { isLearned } from '../lib/srs.js';
import { useProgress } from '../lib/useProgress.jsx';
import ProgressBar from './ProgressBar.jsx';
import Ro from './Ro.jsx';

export default function ScenarioGrid({ onPick }) {
  const { state } = useProgress();
  return (
    <div className="grid grid-cols-2 gap-3">
      {scenarios.map((s) => {
        const items = scenarioItems(s.id, state.mode);
        const learned = items.filter((it) => isLearned(state.cards[it.id])).length;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onPick(s.id)}
            className="text-start rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-bark/5 active:scale-[.98] transition"
          >
            <div className="text-3xl" aria-hidden>{s.icon}</div>
            <div className="mt-1 font-bold">{s.title}</div>
            <Ro className="block text-xs text-bark/55">{s.titleRo}</Ro>
            <ProgressBar value={learned / items.length} className="mt-2.5 h-1.5" color="bg-leaf" />
            <div className="mt-1 text-[11px] text-bark/55">{learned} من {items.length}</div>
          </button>
        );
      })}
    </div>
  );
}
