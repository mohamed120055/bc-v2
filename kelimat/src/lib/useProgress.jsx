import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loadState, saveState, clearState, defaultState } from './storage.js';
import { review } from './srs.js';
import { touchStreak, XP_KNOWN, XP_KNOWN_AFTER_RETRY, XP_AGAIN } from './progress.js';

const Ctx = createContext(null);

export function ProgressProvider({ children }) {
  const [state, setState] = useState(loadState);
  useEffect(() => saveState(state), [state]);

  /** Record one flashcard answer. Returns the XP gained. */
  const answer = useCallback((itemId, known, { retried = false } = {}) => {
    const gained = known ? (retried ? XP_KNOWN_AFTER_RETRY : XP_KNOWN) : XP_AGAIN;
    setState((s) =>
      touchStreak({
        ...s,
        cards: { ...s.cards, [itemId]: review(s.cards[itemId], known) },
        xp: s.xp + gained,
        reviews: s.reviews + 1,
      }),
    );
    return gained;
  }, []);

  const reset = useCallback(() => { clearState(); setState(defaultState()); }, []);
  const setMode = useCallback((mode) => setState((s) => ({ ...s, mode })), []);

  const value = useMemo(() => ({ state, answer, reset, setMode }), [state, answer, reset, setMode]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useProgress = () => useContext(Ctx);
