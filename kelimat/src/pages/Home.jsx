import Ursu from '../components/Ursu.jsx';
import SpeakButton from '../components/SpeakButton.jsx';
import ScenarioGrid from '../components/ScenarioGrid.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import Ro from '../components/Ro.jsx';
import { useProgress } from '../lib/useProgress.jsx';
import { allItems, dailyItem, scenarioById } from '../lib/content.js';
import { countDue } from '../lib/srs.js';
import { currentStreak, levelInfo, practisedToday } from '../lib/progress.js';
import { go } from '../lib/router.js';

function greeting(state, streak) {
  if (practisedToday(state)) return { mood: 'cheer', text: `ممتاز! سلسلتك ${streak} ${streak === 1 ? 'يوم' : 'أيام'} 🔥 نكمّل؟` };
  if (streak > 0) return { mood: 'think', text: 'لا تكسر السلسلة! راجع ولو بطاقة واحدة اليوم.' };
  if (state.reviews > 0) return { mood: 'happy', text: 'اشتقت لك! يلا نرجع للكلمات.' };
  return { mood: 'happy', text: 'أهلاً! أنا أورسو 🐻 خلّينا نتعلم الرومانية اللي تحتاجها كل يوم.' };
}

export default function Home() {
  const { state } = useProgress();
  const streak = currentStreak(state);
  const lvl = levelInfo(state.xp);
  const due = countDue(allItems, state.cards);
  const fresh = allItems.filter((it) => !state.cards[it.id]).length;
  const word = dailyItem();
  const g = greeting(state, streak);

  return (
    <div className="space-y-5">
      <header className="flex items-end gap-2 pt-2">
        <Ursu mood={g.mood} size={92} className="bob shrink-0" />
        <div className="relative mb-6 rounded-2xl rounded-br-sm bg-white px-4 py-3 shadow-sm text-[15px] leading-relaxed">
          {g.text}
        </div>
      </header>

      <section className="grid grid-cols-3 gap-2.5 text-center">
        <Stat big={streak} label={streak === 1 ? 'يوم متتالي' : 'أيام متتالية'} icon="🔥" />
        <Stat big={lvl.level} label={lvl.name} icon="⭐" />
        <Stat big={due} label="للمراجعة" icon="🔁" />
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex justify-between text-sm">
          <span className="font-bold">المستوى {lvl.level} · {lvl.name}</span>
          <span className="text-bark/60">{state.xp} XP</span>
        </div>
        <ProgressBar value={lvl.progress} className="mt-2" />
        <p className="mt-1.5 text-xs text-bark/60">
          {lvl.next ? `باقي ${lvl.toNext} XP للمستوى "${lvl.next.name}"` : 'وصلت لأعلى مستوى! 🏆'}
        </p>
      </section>

      <section className="rounded-3xl bg-gradient-to-bl from-honey to-honey-dark text-white p-5 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold opacity-90">☀️ كلمة اليوم</span>
          <span className="text-xs opacity-80">{scenarioById[word.scenarioId].icon} {scenarioById[word.scenarioId].title}</span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <Ro className="text-3xl font-extrabold break-words">{word.ro}</Ro>
          <div className="flex gap-1.5">
            <SpeakButton text={word.ro} className="bg-white/25 text-white hover:bg-white/35" />
            <SpeakButton text={word.ro} slow className="bg-white/25 hover:bg-white/35" />
          </div>
        </div>
        <div className="mt-1 text-white/90">النطق: <span className="font-semibold">{word.pron}</span></div>
        <div className="mt-2 text-xl font-bold">{word.ar}</div>
        <div className="mt-3 rounded-xl bg-white/15 p-3 text-sm">
          <div className="flex items-center gap-2">
            <Ro className="flex-1 font-semibold">{word.example.ro}</Ro>
            <SpeakButton text={word.example.ro} size="sm" className="bg-white/25 text-white" />
          </div>
          <div className="mt-1 opacity-90">{word.example.ar}</div>
        </div>
      </section>

      <button
        type="button"
        onClick={() => go('learn/all')}
        className="w-full rounded-2xl bg-leaf text-white font-bold text-lg py-4 shadow-md active:scale-[.98] transition"
      >
        {due > 0 ? `ابدأ المراجعة (${due} بطاقة مستحقة)` : fresh > 0 ? 'ابدأ بطاقات جديدة' : 'مراجعة إضافية'}
      </button>

      <section>
        <h2 className="font-bold text-lg mb-2.5">المواقف</h2>
        <ScenarioGrid onPick={(id) => go(`learn/${id}`)} />
      </section>
    </div>
  );
}

function Stat({ big, label, icon }) {
  return (
    <div className="rounded-2xl bg-white py-3 px-1 shadow-sm">
      <div className="text-2xl font-extrabold"><span aria-hidden className="text-lg">{icon}</span> {big}</div>
      <div className="text-[11px] text-bark/60 leading-tight mt-0.5">{label}</div>
    </div>
  );
}
