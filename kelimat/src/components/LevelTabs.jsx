import { MODES, getMode } from '../lib/content.js';
import { useProgress } from '../lib/useProgress.jsx';

/** Level switcher shown at the top of the app: مبتدئ / متوسط / متقدم. */
export default function LevelTabs() {
  const { state, setMode } = useProgress();
  const active = getMode(state.mode);

  return (
    <div>
      <div className="grid grid-cols-3 gap-1 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-bark/10" role="radiogroup" aria-label="المستوى">
        {MODES.map((m) => {
          const on = m.id === active.id;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setMode(m.id)}
              className={`rounded-xl py-2 text-sm font-bold transition ${on ? 'bg-leaf text-white shadow' : 'text-bark/70 active:bg-cream'}`}
            >
              <span aria-hidden>{m.icon}</span> {m.name}
            </button>
          );
        })}
      </div>
      <p className="mt-1.5 px-1 text-xs text-bark/60">{active.desc}</p>
    </div>
  );
}
