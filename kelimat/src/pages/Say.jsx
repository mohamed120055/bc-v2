import { useMemo, useState } from 'react';
import SpeakButton from '../components/SpeakButton.jsx';
import VoiceNotice from '../components/VoiceNotice.jsx';
import Ursu from '../components/Ursu.jsx';
import Ro from '../components/Ro.jsx';
import BackButton from '../components/BackButton.jsx';
import { scenarios } from '../lib/content.js';
import { go } from '../lib/router.js';

// Strip Arabic diacritics and Romanian accents so search is forgiving.
const norm = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ًͯ-ٰٟ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');

export default function Say({ scenarioId }) {
  const [q, setQ] = useState('');
  const active = scenarios.some((s) => s.id === scenarioId) ? scenarioId : 'all';

  const groups = useMemo(() => {
    const nq = norm(q.trim());
    return scenarios
      .filter((s) => active === 'all' || s.id === active)
      .map((s) => ({ ...s, phrases: s.phrases.filter((p) => !nq || norm(p.ar).includes(nq) || norm(p.ro).includes(nq)) }))
      .filter((s) => s.phrases.length);
  }, [q, active]);

  const chip = (on) => `shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${on ? 'bg-bark text-white' : 'bg-white text-bark shadow-sm'}`;

  return (
    <div className="space-y-4 pt-2">
      <BackButton />
      <div className="flex items-center gap-2">
        <Ursu mood="think" size={56} />
        <div>
          <h1 className="text-2xl font-extrabold">كيف أقولها؟</h1>
          <p className="text-sm text-bark/60">جمل جاهزة لكل موقف — اضغط 🔊 وكرّر بعده</p>
        </div>
      </div>

      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="ابحث… مثلاً: صيدلية، تذكرة، إيجار"
        className="w-full rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-bark/10 outline-none focus:ring-2 focus:ring-honey placeholder:text-bark/40"
      />

      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
        <button type="button" className={chip(active === 'all')} onClick={() => go('say')}>الكل</button>
        {scenarios.map((s) => (
          <button key={s.id} type="button" className={chip(active === s.id)} onClick={() => go(`say/${s.id}`)}>
            {s.icon} {s.title}
          </button>
        ))}
      </div>

      <VoiceNotice />

      {groups.length === 0 && <p className="text-center text-bark/60 py-8">ما لقينا جملة مناسبة 🤔 جرّب كلمة أخرى.</p>}

      {groups.map((s) => (
        <section key={s.id} className="space-y-2.5">
          {active === 'all' && <h2 className="font-bold text-bark/70">{s.icon} {s.title}</h2>}
          {s.phrases.map((p) => (
            <article key={p.id} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="font-bold text-[17px]">{p.ar}</div>
              <div className="mt-2 flex items-center gap-2">
                <Ro className="flex-1 text-lg font-semibold text-sky leading-snug">{p.ro}</Ro>
                <SpeakButton text={p.ro} />
                <SpeakButton text={p.ro} slow />
              </div>
              <div className="mt-1.5 text-sm text-bark/70">🗣️ {p.pron}</div>
            </article>
          ))}
        </section>
      ))}
    </div>
  );
}
