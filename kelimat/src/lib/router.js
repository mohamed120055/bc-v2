import { useEffect, useState } from 'react';

// Links look like #learn-train or #say-doctor (plain names work everywhere the app is hosted).
// Older #/learn/train links are still understood.
const read = () => {
  const h = window.location.hash.replace(/^#\/?/, '');
  const i = h.search(/[-/]/);
  return (i < 0 ? [h] : [h.slice(0, i), h.slice(i + 1)]).filter(Boolean);
};

// In-app history, so "رجوع" goes to the previous screen (and never leaves the app).
const stack = [window.location.hash || '#home'];
window.addEventListener('hashchange', () => {
  const h = window.location.hash || '#home';
  if (stack.length > 1 && stack[stack.length - 2] === h) stack.pop(); // went back
  else if (stack[stack.length - 1] !== h) stack.push(h);
});

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

/** Previous screen inside the app, or home if the app was opened directly on this screen. */
export function goBack() {
  if (stack.length > 1) window.history.back();
  else go('');
}
