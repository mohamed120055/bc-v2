import { goBack } from '../lib/router.js';

/** "رجوع" — returns to the previous screen. In RTL the arrow points right (back). */
export default function BackButton({ className = '' }) {
  return (
    <button
      type="button"
      onClick={goBack}
      className={`inline-flex items-center gap-1.5 rounded-full bg-white shadow-sm ring-1 ring-bark/10 ps-2.5 pe-3.5 py-1.5 text-sm font-bold active:scale-95 transition ${className}`}
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M9 6l6 6-6 6" />
      </svg>
      رجوع
    </button>
  );
}
