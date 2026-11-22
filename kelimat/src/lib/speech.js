// Romanian text-to-speech via the Web Speech API, hardened against common mobile browser bugs.
const synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
let roVoice = null;
let voiceCount = 0;
let current = null; // keep a reference: Chrome can garbage-collect a playing utterance and cut it off
const voiceListeners = new Set();
const problemListeners = new Set();

function pickVoice() {
  if (!synth) return;
  const voices = synth.getVoices();
  voiceCount = voices.length;
  roVoice =
    voices.find((v) => /^ro[-_]RO$/i.test(v.lang)) ??
    voices.find((v) => /^ro([-_]|$)/i.test(v.lang)) ??
    null;
  voiceListeners.forEach((fn) => fn());
}

if (synth) {
  pickVoice();
  synth.addEventListener?.('voiceschanged', pickVoice);
  // Some browsers (iOS Safari, older Android) never fire voiceschanged: poll briefly.
  let tries = 0;
  const poll = setInterval(() => { if (voiceCount || ++tries > 20) clearInterval(poll); else pickVoice(); }, 250);
}

export const canSpeak = () => !!synth;
export const hasRomanianVoice = () => !!roVoice;
export const voiceInfo = () => ({ supported: !!synth, count: voiceCount, ro: roVoice ? `${roVoice.name} (${roVoice.lang})` : null });
export function onVoicesChanged(fn) { voiceListeners.add(fn); return () => voiceListeners.delete(fn); }

/** Subscribe to playback problems: reason is 'unsupported' | 'no-voice' | 'silent' | an engine error code. */
export function onSpeechProblem(fn) { problemListeners.add(fn); return () => problemListeners.delete(fn); }
const report = (reason) => problemListeners.forEach((fn) => fn(reason));

export function speak(text, { slow = false } = {}) {
  if (!synth) { report('unsupported'); return false; }
  if (!voiceCount) pickVoice();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ro-RO';
  if (roVoice) u.voice = roVoice;
  u.rate = slow ? 0.6 : 0.9;
  u.volume = 1;

  let started = false;
  u.onstart = () => { started = true; };
  u.onerror = (e) => {
    if (e.error === 'interrupted' || e.error === 'canceled') return; // user tapped another word
    report(e.error === 'language-unavailable' || e.error === 'voice-unavailable' ? 'no-voice' : e.error || 'silent');
  };
  current = u;

  const play = () => { synth.resume(); synth.speak(u); }; // resume(): Chrome can get stuck "paused"
  // Chrome on Android drops an utterance queued right after cancel(); give it a moment.
  if (synth.speaking || synth.pending) { synth.cancel(); setTimeout(play, 80); } else play();

  // Watchdog: if nothing started, tell the user why instead of failing silently.
  setTimeout(() => {
    if (!started && current === u) report(roVoice ? 'silent' : 'no-voice');
  }, 3000);
  return true;
}
