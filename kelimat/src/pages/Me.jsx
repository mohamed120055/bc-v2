import { useState } from 'react';
import Ursu from '../components/Ursu.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import Ro from '../components/Ro.jsx';
import { useProgress } from '../lib/useProgress.jsx';
import { allItems, scenarios } from '../lib/content.js';
import { isLearned } from '../lib/srs.js';
import { LEVELS, currentStreak, levelInfo } from '../lib/progress.js';

const KEY = [
  ['ă', 'ـَ / ـَه', 'فتحة خفيفة قصيرة (مثل a في كلمة about)'],
  ['â / î', 'ـِ', 'صوت مكتوم بين الكسرة والضمة — قلها من الحلق'],
  ['ș', 'ش', 'șef ← شِف'],
  ['ț', 'تس', 'rețetă ← رِتْسِتَه'],
  ['ce / ci', 'تشِ / تشي', 'farmacie ← فارْماتْشيِه'],
  ['che / chi', 'كِ / كي', 'chirie ← كيريِه'],
  ['ge / gi', 'جِ / جي', 'alergie ← آلِرْجيِه'],
  ['g (غير ذلك)', 'گ', 'جيم مصرية: gară ← گارَه'],
  ['j', 'ژ', 'مثل j الفرنسية: Cluj ← كلوژ'],
  ['p / v', 'پ / ڤ', 'pâine ← پِينِه، vagon ← ڤاگون'],
  ['e في البداية', 'يِـ', 'este ← يِسْتِه'],
];

export default function Me() {
  const { state, reset } = useProgress();
  const [confirming, setConfirming] = useState(false);
  const lvl = levelInfo(state.xp);
  const learned = allItems.filter((it) => isLearned(state.cards[it.id])).length;
  const strong = allItems.filter((it) => (state.cards[it.id]?.box ?? 0) >= 3).length;

  return (
    <div className="space-y-5 pt-2">
      <div className="flex items-center gap-3">
        <Ursu mood={state.reviews ? 'cheer' : 'sleepy'} size={80} />
        <div>
          <h1 className="text-2xl font-extrabold">تقدّمي</h1>
          <p className="text-bark/70">المستوى {lvl.level} · {lvl.name} · {state.xp} XP</p>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-2.5">
        <Tile n={currentStreak(state)} label="🔥 السلسلة الحالية" />
        <Tile n={state.bestStreak} label="🏅 أطول سلسلة" />
        <Tile n={`${learned}/${allItems.length}`} label="📚 كلمات بدأت تتعلمها" />
        <Tile n={strong} label="💪 كلمات ثابتة (٣ مراجعات+)" />
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm space-y-3">
        <h2 className="font-bold">حسب الموقف</h2>
        {scenarios.map((s) => {
          const n = s.items.filter((it) => isLearned(state.cards[it.id])).length;
          return (
            <div key={s.id}>
              <div className="flex justify-between text-sm"><span>{s.icon} {s.title}</span><span className="text-bark/60">{n}/{s.items.length}</span></div>
              <ProgressBar value={n / s.items.length} className="mt-1 h-2" color="bg-leaf" />
            </div>
          );
        })}
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="font-bold mb-2">المستويات</h2>
        <ol className="space-y-1.5">
          {LEVELS.map((l, i) => {
            const reached = state.xp >= l.min;
            return (
              <li key={l.name} className={`flex justify-between text-sm ${reached ? '' : 'text-bark/40'}`}>
                <span>{reached ? '✅' : '🔒'} {i + 1}. {l.name}</span>
                <span>{l.min} XP</span>
              </li>
            );
          })}
        </ol>
        <p className="mt-3 text-xs text-bark/60">عارفها = 10 XP · لسه = 2 XP (المحاولة نفسها تستاهل!)</p>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="font-bold mb-1">دليل النطق</h2>
        <p className="text-sm text-bark/60 mb-3">كيف نكتب الأصوات الرومانية بالحروف العربية في هذا التطبيق:</p>
        <table className="w-full text-sm">
          <tbody>
            {KEY.map(([ro, ar, note]) => (
              <tr key={ro} className="border-t border-bark/5 align-top">
                <td className="py-1.5 pe-2 font-bold whitespace-nowrap"><Ro>{ro}</Ro></td>
                <td className="py-1.5 pe-2 font-bold text-leaf whitespace-nowrap">{ar}</td>
                <td className="py-1.5 text-bark/70">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm text-sm text-bark/70 leading-relaxed">
        <h2 className="font-bold text-bark mb-1">مين أورسو؟ 🐻</h2>
        <p><Ro className="font-semibold">Ursu</Ro> تعني "الدب" باللهجة الرومانية العامية. لابس وشاح بألوان علم رومانيا، ويرافقك في كل يوم تتعلم فيه.</p>
      </section>

      {confirming ? (
        <div className="rounded-2xl border border-berry/40 bg-white p-4 space-y-3 pop">
          <p className="font-semibold">هل تريد حذف كل التقدّم؟ لا يمكن التراجع.</p>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => { reset(); setConfirming(false); }} className="rounded-xl bg-berry text-white font-bold py-3">نعم، احذف</button>
            <button type="button" onClick={() => setConfirming(false)} className="rounded-xl bg-cream font-bold py-3">إلغاء</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setConfirming(true)} className="w-full rounded-2xl border border-berry/40 text-berry font-semibold py-3">
          إعادة ضبط التقدّم
        </button>
      )}
    </div>
  );
}

function Tile({ n, label }) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm">
      <div className="text-2xl font-extrabold">{n}</div>
      <div className="text-xs text-bark/60">{label}</div>
    </div>
  );
}
