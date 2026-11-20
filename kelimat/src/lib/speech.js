// Romanian text-to-speech via the Web Speech API.
const synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
let roVoice = null;
const listeners = new Set();

function pickVoice() {
  if (!synth) return;
  const voices = synth.getVoices();
  roVoice = voices.find((v) => /^ro([-_]|$)/i.test(v.lang)) ?? null;
  listeners.forEach((fn) => fn());
}

if (synth) {
  pickVoice();
  synth.addEventListener?.('voiceschanged', pickVoice);
}

export const canSpeak = () => !!synth;
export const hasRomanianVoice = () => !!roVoice;
export function onVoicesChanged(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export function speak(text, { slow = false } = {}) {
  if (!synth) return false;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ro-RO';
  if (roVoice) u.voice = roVoice;
  u.rate = slow ? 0.6 : 0.9;
  synth.speak(u);
  return true;
}
