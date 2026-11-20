// Ursu — Kelimat's original mascot: a small round bear in a blue-yellow-red scarf.
// mood: 'happy' | 'cheer' | 'think' | 'sleepy'
const FUR = '#A86B3C';
const FUR_DARK = '#8A5530';
const INNER = '#E8B48A';
const MUZZLE = '#F3D2AE';
const INK = '#3B2314';

function Eyes({ mood }) {
  if (mood === 'cheer') {
    return (
      <g stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none">
        <path d="M40 58 q6 -7 12 0" />
        <path d="M68 58 q6 -7 12 0" />
      </g>
    );
  }
  if (mood === 'sleepy') {
    return (
      <g stroke={INK} strokeWidth="3.5" strokeLinecap="round">
        <path d="M40 59 h12" />
        <path d="M68 59 h12" />
      </g>
    );
  }
  const dx = mood === 'think' ? -2 : 0;
  const dy = mood === 'think' ? -2 : 0;
  return (
    <g>
      <circle cx={46 + dx} cy={58 + dy} r="5" fill={INK} />
      <circle cx={74 + dx} cy={58 + dy} r="5" fill={INK} />
      <circle cx={47.6 + dx} cy={56.4 + dy} r="1.6" fill="#fff" />
      <circle cx={75.6 + dx} cy={56.4 + dy} r="1.6" fill="#fff" />
    </g>
  );
}

function Mouth({ mood }) {
  if (mood === 'cheer') return <path d="M53 77 q7 10 14 0 z" fill={INK} />;
  if (mood === 'think') return <circle cx="60" cy="79" r="2.6" fill={INK} />;
  if (mood === 'sleepy') return <path d="M55 79 q5 3 10 0" stroke={INK} strokeWidth="2.5" fill="none" strokeLinecap="round" />;
  return <path d="M53 77 q7 6 14 0" stroke={INK} strokeWidth="2.8" fill="none" strokeLinecap="round" />;
}

export default function Ursu({ mood = 'happy', size = 96, className = '', title = 'أورسو' }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className={className} role="img" aria-label={title}>
      {/* body + paws */}
      <ellipse cx="60" cy="106" rx="30" ry="16" fill={FUR_DARK} />
      {mood === 'cheer' ? (
        <g fill={FUR}>
          <ellipse cx="22" cy="80" rx="8" ry="11" transform="rotate(-30 22 80)" />
          <ellipse cx="98" cy="80" rx="8" ry="11" transform="rotate(30 98 80)" />
        </g>
      ) : (
        <g fill={FUR}>
          <ellipse cx="38" cy="108" rx="8" ry="6" />
          <ellipse cx="82" cy="108" rx="8" ry="6" />
        </g>
      )}
      {/* ears */}
      <circle cx="30" cy="30" r="15" fill={FUR} />
      <circle cx="30" cy="30" r="7.5" fill={INNER} />
      <circle cx="90" cy="30" r="15" fill={FUR} />
      <circle cx="90" cy="30" r="7.5" fill={INNER} />
      {/* head */}
      <circle cx="60" cy="60" r="37" fill={FUR} />
      {/* scarf: blue, yellow, red bands + hanging end */}
      <path d="M27 86 Q60 102 93 86 L94 94 Q60 110 26 94 Z" fill="#F2C230" />
      <path d="M27 86 Q38 92 46 95 L44 103 Q34 100 26 94 Z" fill="#2B5DAA" />
      <path d="M74 95 Q84 92 93 86 L94 94 Q86 100 76 103 Z" fill="#D2413A" />
      <path d="M78 98 l8 16 l-9 2 l-5 -15 z" fill="#D2413A" />
      {/* face */}
      <circle cx="38" cy="72" r="5.5" fill="#E98A7A" opacity="0.55" />
      <circle cx="82" cy="72" r="5.5" fill="#E98A7A" opacity="0.55" />
      <ellipse cx="60" cy="73" rx="16" ry="12" fill={MUZZLE} />
      <ellipse cx="60" cy="67.5" rx="6" ry="4.3" fill={INK} />
      <Eyes mood={mood} />
      <Mouth mood={mood} />
      {mood === 'sleepy' && (
        <text x="92" y="22" fontSize="14" fontWeight="700" fill={FUR_DARK} fontFamily="sans-serif">z</text>
      )}
    </svg>
  );
}
