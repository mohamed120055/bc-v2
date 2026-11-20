import { useEffect, useState } from 'react';

// Links look like #learn-train or #say-doctor (plain names work everywhere the app is hosted).
// Older #/learn/train links are still understood.
const read = () => {
  const h = window.location.hash.replace(/^#\/?/, '');
  const i = h.search(/[-/]/);
  return (i < 0 ? [h] : [h.slice(0, i), h.slice(i + 1)]).filter(Boolean);
};

/** Tiny hash router so the phone's back button works. */
export function useRoute() {
  const [parts, setParts] = useState(read);
  useEffect(() => {
    const onChange = () => { setParts(read()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return parts;
}

export const go = (path = '') => { window.location.hash = path ? '#' + path.replace('/', '-') : '#home'; };
