import { useState } from 'react';
import Ursu from '../components/Ursu.jsx';
import SpeakButton from '../components/SpeakButton.jsx';
import ScenarioGrid from '../components/ScenarioGrid.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import VoiceNotice from '../components/VoiceNotice.jsx';
import Ro from '../components/Ro.jsx';
import { useProgress } from '../lib/useProgress.jsx';
import { getMode, itemsForMode, scenarioById, scenarioItems } from '../lib/content.js';
import { buildQueue, countDue, requeue } from '../lib/srs.js';
import { currentStreak } from '../lib/progress.js';
import { go } from '../lib/router.js';

export default function Learn({ scenarioId }) {
  const [round, setRound] = useState(0);
  if (!scenarioId) return <Picker />;
  const valid = scenarioId === 'all' || scenarioById[scenarioId];
  if (!valid) return <Picker />;
  return <Session key={`${scenarioId}-${round}`} scenarioId={scenarioId} onAgain={() => setRound((r) => r + 1)} />;
}

function Picker() {
  const { state } = useProgress();
  const due = countDue(itemsForMode(state.mode), state.cards);
  return (
    <div className="space-y-4 pt-2">
      <h1 className="text-2xl font-extrabold">البطاقات</h1>
      <VoiceNotice />
      <button
        type="button"
        onClick={() => go('learn/all')}
        className="w-full flex items-center gap-3 rounded-2xl bg-leaf text-white p-4 shadow-md text-start active:scale-[.98] transition"
      >
        <span className="text-3xl" aria-hidden>🔁</span>
        <span className="flex-1">
          <span className="block font-bold text-lg">مراجعة ذكية من كل المواقف</span>
          <span className="block text-sm opacity-90">{due > 0 ? `${due} بطاقة مستحقة اليوم + كلمات جديدة` : 'كلمات جديدة ومراجعة'}</span>
        </span>
      </button>
      <p className="text-sm text-bark/60">أو اختر موقفاً:</p>
      <ScenarioGrid onPick={(id) => go(`learn/${id}`)} />
    </div>
  );
}

function Session({ scenarioId, onAgain }) {
  const { state, answer } = useProgress();
  const mode = getMode(state.mode);
  const items = scenarioId === 'all' ? itemsForMode(mode.id) : scenarioItems(scenarioId, mode.id);
  // Build the queue once per session; answers update storage but not the running queue.
  const [{ queue: initial, extra }] = useState(() => buildQueue(items, state.cards, mode.session));
  const [queue, setQueue] = useState(initial);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [missed, setMissed] = useState(() => new Set());
  const [stats, setStats] = useState({ known: 0, again: 0, xp: 0 });

  const title = scenarioId === 'all' ? 'مراجعة ذكية' : `${scenarioById[scenarioId].icon} ${scenarioById[scenarioId].title}`;

  if (idx >= queue.length) {
    return <Done stats={stats} streak={currentStreak(state)} onAgain={onAgain} scenarioId={scenarioId} />;
  }

  const item = queue[idx];
  const respond = (known) => {
    const xp = answer(item.id, known, { retried: missed.has(item.id) });
    setStats((s) => ({ known: s.known + (known ? 1 : 0), again: s.again + (known ? 0 : 1), xp: s.xp + xp }));
    if (!known) {
      setQueue((q) => requeue(q, idx));
      setMissed((m) => new Set(m).add(item.id));
    }
    setFlipped(false);
    setIdx((i) => i + 1);
  };

  return (
    <div className="pt-2 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => go('learn')} className="size-10 grid place-items-center rounded-full bg-white shadow-sm text-xl" aria-label="إنهاء الجلسة">✕</button>
        <div className="flex-1">
          <div className="flex justify-between text-sm font-semibold">
            <span>{title} <span className="text-bark/50 font-normal">· {mode.icon} {mode.name}</span></span>
            <span className="text-bark/60">{idx + 1} / {queue.length}</span>
          </div>
          <ProgressBar value={idx / queue.length} className="mt-1.5" color="bg-leaf" />
        </div>
      </div>

      {extra && idx === 0 && (
        <p className="rounded-xl bg-sky/10 text-sm px-3 py-2">👏 لا توجد بطاقات مستحقة الآن. هذه جولة إضافية لتقوية الكلمات الأضعف.</p>
      )}

      <Card key={idx} item={item} mode={mode} flipped={flipped} onFlip={() => setFlipped((f) => !f)} retry={missed.has(item.id)} />

      {flipped ? (
        <div className="grid grid-cols-2 gap-3 pop">
          <button type="button" onClick={() => respond(true)} className="rounded-2xl bg-leaf text-white font-extrabold text-xl py-4 shadow-md active:scale-95 transition">
            عارفها ✓
          </button>
          <button type="button" onClick={() => respond(false)} className="rounded-2xl bg-berry text-white font-extrabold text-xl py-4 shadow-md active:scale-95 transition">
            لسه ↻
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => setFlipped(true)} className="rounded-2xl bg-bark text-white font-bold text-lg py-4 shadow-md active:scale-95 transition">
          اقلب البطاقة
        </button>
      )}
    </div>
  );
}

function Card({ item, mode, flipped, onFlip, retry }) {
  const sc = scenarioById[item.scenarioId];
  const [showPron, setShowPron] = useState(!mode.reverse);
  const face = 'flip-face rounded-3xl bg-white shadow-md ring-1 ring-bark/5 p-5 flex flex-col';
  const chip = (
    <div className="text-xs text-bark/55">
      {sc.icon} {sc.title}{retry && <span className="ms-2 rounded-full bg-berry/15 text-berry px-2 py-0.5">مرة ثانية</span>}
    </div>
  );
  const pron = (
    <div className="rounded-xl bg-honey/15 px-3 py-2 text-center">
      <span className="text-xs text-bark/60 block">النطق بالحروف العربية</span>
      <span className="text-xl font-bold">{item.pron}</span>
    </div>
  );
  const long = item.ro.length > 28;

  // Advanced mode is reversed: Arabic first, the learner tries to say it in Romanian.
  const front = mode.reverse ? (
    <>
      {chip}
      <div className="text-3xl font-extrabold leading-snug">{item.ar}</div>
      <div className="text-sm text-bark/60">قولها بالروماني بصوت عالي… وبعدين اقلب البطاقة</div>
    </>
  ) : (
    <>
      {chip}
      <Ro as="div" className={`${long ? 'text-2xl' : 'text-4xl'} font-extrabold leading-tight break-words`}>{item.ro}</Ro>
      <div className="flex gap-2">
        <SpeakButton text={item.ro} size="lg" />
        <SpeakButton text={item.ro} size="lg" slow />
      </div>
      {mode.pronOnFront && <div className="text-xl font-bold text-bark/80">🗣️ {item.pron}</div>}
      <div className="text-sm text-bark/50">اضغط على البطاقة لرؤية المعنى</div>
    </>
  );

  const back = (
    <>
      <div className="text-center">
        {mode.reverse ? (
          <>
            <div className="text-xs text-bark/55 mb-1">بالروماني:</div>
            <div className="flex items-center justify-center gap-2">
              <Ro className={`${long ? 'text-xl' : 'text-2xl'} font-extrabold text-leaf leading-snug`}>{item.ro}</Ro>
              <SpeakButton text={item.ro} size="sm" />
              <SpeakButton text={item.ro} size="sm" slow />
            </div>
            <div className="mt-1 text-bark/70">{item.ar}</div>
          </>
        ) : (
          <>
            <div className="text-3xl font-extrabold text-leaf">{item.ar}</div>
            <div className="mt-2 flex items-center justify-center gap-2">
              <Ro className="text-lg font-bold">{item.ro}</Ro>
              <SpeakButton text={item.ro} size="sm" />
            </div>
          </>
        )}
      </div>
      {showPron ? pron : (
        <button type="button" onClick={(e) => { e.stopPropagation(); setShowPron(true); }} className="rounded-xl bg-honey/15 py-2 text-sm font-semibold">
          🗣️ إظهار النطق بالعربي
        </button>
      )}
      <div className="mt-auto rounded-xl bg-cream p-3">
        <div className="text-xs text-bark/55 mb-1">{mode.reverse ? 'الرد المتوقع' : 'مثال'}</div>
        <div className="flex items-center gap-2">
          <Ro className="flex-1 font-semibold">{item.example.ro}</Ro>
          <SpeakButton text={item.example.ro} size="sm" />
        </div>
        <div className="mt-1 text-bark/80">{item.example.ar}</div>
      </div>
    </>
  );

  return (
    <div className="flip">
      <div
        className={`flip-inner ${flipped ? 'flipped' : ''}`}
        onClick={onFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onFlip())}
        aria-label={flipped ? 'إظهار الوجه الأول' : 'إظهار الإجابة'}
      >
        <div className={`${face} min-h-80 items-center justify-center text-center gap-5`} aria-hidden={flipped}>{front}</div>
        <div className={`${face} flip-back min-h-80 gap-3`} aria-hidden={!flipped}>{back}</div>
      </div>
    </div>
  );
}

function Done({ stats, streak, onAgain, scenarioId }) {
  const total = stats.known + stats.again;
  return (
    <div className="pt-8 flex flex-col items-center text-center gap-4 pop">
      <Ursu mood="cheer" size={140} className="bob" />
      <h1 className="text-2xl font-extrabold">برافو! خلّصت الجلسة 🎉</h1>
      <Ro as="p" className="text-bark/70">Bravo! Ai terminat.</Ro>
      <div className="grid grid-cols-3 gap-2.5 w-full">
        <Box n={stats.known} label="عارفها" cls="text-leaf" />
        <Box n={stats.again} label="لسه" cls="text-berry" />
        <Box n={`+${stats.xp}`} label="XP" cls="text-honey-dark" />
      </div>
      {total > 0 && <p className="text-sm">🔥 سلسلتك الآن: <b>{streak}</b> {streak === 1 ? 'يوم' : 'أيام'}</p>}
      <p className="text-sm text-bark/60">الكلمات اللي قلت عنها "لسه" راح ترجع لك قريباً، واللي تعرفها راح تتباعد مع الوقت.</p>
      <div className="grid grid-cols-2 gap-3 w-full mt-2">
        <button type="button" onClick={onAgain} className="rounded-2xl bg-leaf text-white font-bold py-3.5 shadow-md">جلسة ثانية</button>
        <button type="button" onClick={() => go('')} className="rounded-2xl bg-white font-bold py-3.5 shadow-sm">الرئيسية</button>
      </div>
      {scenarioId !== 'all' && (
        <button type="button" onClick={() => go(`say/${scenarioId}`)} className="text-sky font-semibold text-sm underline underline-offset-4">
          جمل جاهزة لهذا الموقف ←
        </button>
      )}
    </div>
  );
}

function Box({ n, label, cls }) {
  return (
    <div className="rounded-2xl bg-white py-3 shadow-sm">
      <div className={`text-2xl font-extrabold ${cls}`}>{n}</div>
      <div className="text-xs text-bark/60">{label}</div>
    </div>
  );
}
