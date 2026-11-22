import { useEffect, useState } from 'react';
import { onSpeechProblem } from '../lib/speech.js';
import { go } from '../lib/router.js';
import VoiceFixSteps from './VoiceFixSteps.jsx';

const TITLES = {
  unsupported: 'المتصفح ده مش بيدعم الصوت',
  'no-voice': 'مفيش صوت روماني على الجهاز',
  silent: 'الصوت ما اشتغلش',
};

/** Pops up when a "listen" tap produced no sound, with steps to fix it. */
export default function SpeechHelp() {
  const [reason, setReason] = useState(null);
  useEffect(() => onSpeechProblem(setReason), []);
  if (!reason) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 p-3 pb-safe pop" role="alertdialog" aria-labelledby="speech-help-title">
      <div className="max-w-md mx-auto rounded-3xl bg-white shadow-2xl ring-1 ring-bark/10 p-5 text-sm leading-relaxed">
        <div className="flex items-start gap-3">
          <span className="text-3xl" aria-hidden>🔇</span>
          <div className="flex-1">
            <h2 id="speech-help-title" className="font-extrabold text-base">{TITLES[reason] ?? TITLES.silent}</h2>
            <p className="text-bark/70 mt-0.5">جرّب الخطوات دي:</p>
          </div>
        </div>
        <div className="mt-3"><VoiceFixSteps /></div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button type="button" className="rounded-xl bg-bark text-white font-bold py-2.5" onClick={() => { setReason(null); go('me'); setTimeout(() => document.getElementById('voice-test')?.scrollIntoView({ behavior: 'smooth' }), 150); }}>
            اختبار الصوت
          </button>
          <button type="button" className="rounded-xl bg-cream font-bold py-2.5" onClick={() => setReason(null)}>تمام</button>
        </div>
      </div>
    </div>
  );
}
