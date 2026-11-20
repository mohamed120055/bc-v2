import { useEffect, useState } from 'react';

const read = () => window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);

/** Tiny hash router so the phone's back button works: #/learn/train → ['learn', 'train'] */
export function useRoute() {
  const [parts, setParts] = useState(read);
  useEffect(() => {
    const onChange = () => { setParts(read()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return parts;
}

export const go = (path = '') => { window.location.hash = '#/' + path; };
