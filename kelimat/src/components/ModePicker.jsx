import Ursu from './Ursu.jsx';
import { MODES, itemsForMode } from '../lib/content.js';
import { useProgress } from '../lib/useProgress.jsx';

/** Choose beginner / intermediate / advanced. Full-screen on first launch, compact in settings. */
export default function ModePicker({ compact = false, onDone }) {
  const { state, setMode } = useProgress();

  const list = (
    <div className="grid gap-3" role="radiogroup" aria-label="اختر المستوى">
      {MODES.map((m) => {
        const on = state.mode === m.id;
        return (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => { setMode(m.id); onDone?.(m.id); }}
            className={`text-start rounded-2xl p-4 flex items-center gap-3 transition active:scale-[.98] ${on ? 'bg-leaf text-white shadow-md' : 'bg-white shadow-sm ring-1 ring-bark/10'}`}
          >
            <span className="text-4xl" aria-hidden>{m.icon}</span>
            <span className="flex-1">
              <span className="block font-extrabold text-lg">{m.name}</span>
              <span className={`block text-sm leading-relaxed ${on ? 'text-white/90' : 'text-bark/70'}`}>{m.desc}</span>
              <span className={`block text-xs mt-1 ${on ? 'text-white/80' : 'text-bark/50'}`}>{itemsForMode(m.id).length} كلمة وجملة</span>
            </span>
            {on && <span aria-hidden className="text-xl">✓</span>}
          </button>
        );
      })}
    </div>
  );

  if (compact) return list;

  return (
    <div className="pt-6 space-y-5 pop">
      <div className="flex flex-col items-center text-center gap-2">
        <Ursu mood="happy" size={120} className="bob" />
        <h1 className="text-2xl font-extrabold">أهلاً بيك في كلمات! 🎉</h1>
        <p className="text-bark/70 leading-relaxed">أنا أورسو 🐻 هساعدك تتعلم الرومانية اللي هتحتاجها في حياتك اليومية.<br />تحب تبدأ من أي مستوى؟</p>
      </div>
      {list}
      <p className="text-center text-xs text-bark/50">تقدر تغيّر المستوى في أي وقت من صفحة «تقدّمي».</p>
    </div>
  );
}
