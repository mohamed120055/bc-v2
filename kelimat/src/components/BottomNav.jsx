import { go } from '../lib/router.js';

const icons = {
  home: <path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  learn: <><rect x="3" y="6" width="13" height="15" rx="2" /><path d="M8 3h11a2 2 0 0 1 2 2v13" /></>,
  say: <path d="M4 5h16v11H9l-5 4z" />,
  me: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
};

const tabs = [
  { id: '', key: 'home', label: 'الرئيسية' },
  { id: 'learn', key: 'learn', label: 'البطاقات' },
  { id: 'say', key: 'say', label: 'كيف أقولها؟' },
  { id: 'me', key: 'me', label: 'تقدّمي' },
];

export default function BottomNav({ active }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 bg-white/95 backdrop-blur border-t border-bark/10 pb-safe">
      <ul className="max-w-md mx-auto grid grid-cols-4">
        {tabs.map((t) => {
          const on = active === t.id;
          return (
            <li key={t.key}>
              <button
                type="button"
                onClick={() => go(t.id)}
                aria-current={on ? 'page' : undefined}
                className={`w-full flex flex-col items-center gap-0.5 pt-2 pb-1 text-xs font-semibold transition ${on ? 'text-honey-dark' : 'text-bark/55'}`}
              >
                <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {icons[t.key]}
                </svg>
                {t.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
