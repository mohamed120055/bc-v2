import { speak } from '../lib/speech.js';

const sizes = { sm: 'size-9', md: 'size-11', lg: 'size-14' };

export default function SpeakButton({ text, slow = false, size = 'md', className = '' }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); speak(text, { slow }); }}
      className={`${sizes[size]} shrink-0 grid place-items-center rounded-full bg-honey/20 text-bark active:scale-95 transition hover:bg-honey/35 ${className}`}
      aria-label={slow ? `استمع ببطء: ${text}` : `استمع: ${text}`}
      title={slow ? 'استمع ببطء' : 'استمع'}
    >
      {slow ? (
        <span aria-hidden className={size === 'sm' ? 'text-base' : 'text-xl'}>🐢</span>
      ) : (
        <svg viewBox="0 0 24 24" className={size === 'sm' ? 'size-5' : 'size-6'} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          {/* mirrored for RTL so the sound waves point "forward" */}
          <g transform="translate(24 0) scale(-1 1)">
            <path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
          </g>
        </svg>
      )}
    </button>
  );
}
