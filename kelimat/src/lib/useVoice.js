import { useEffect, useState } from 'react';
import { canSpeak, hasRomanianVoice, onVoicesChanged } from './speech.js';

/** 'unsupported' | 'ro' | 'fallback' (speech works but no Romanian voice installed) */
export function useVoiceStatus() {
  const get = () => (!canSpeak() ? 'unsupported' : hasRomanianVoice() ? 'ro' : 'fallback');
  const [status, setStatus] = useState(get);
  useEffect(() => onVoicesChanged(() => setStatus(get())), []);
  return status;
}
