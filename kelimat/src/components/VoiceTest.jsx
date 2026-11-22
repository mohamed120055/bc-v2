import { useEffect, useState } from 'react';
import { onVoicesChanged, speak, voiceInfo } from '../lib/speech.js';
import VoiceFixSteps from './VoiceFixSteps.jsx';

/** Diagnostics card: what the device reports, plus a test button. Users can screenshot this. */
export default function VoiceTest() {
  const [info, setInfo] = useState(voiceInfo);
  useEffect(() => onVoicesChanged(() => setInfo(voiceInfo())), []);
  const ok = info.supported && info.ro;

  const Row = ({ label, value, good }) => (
    <div className="flex justify-between gap-3 py-1.5 border-t border-bark/5">
      <span className="text-bark/70">{label}</span>
      <span className={`font-semibold text-end ${good ? 'text-leaf' : 'text-berry'}`} dir="auto">{value}</span>
    </div>
  );

  return (
    <section id="voice-test" className="rounded-2xl bg-white p-4 shadow-sm text-sm scroll-mt-4">
      <h2 className="font-bold text-base mb-2">🔊 اختبار الصوت</h2>
      <Row label="المتصفح بيدعم الصوت" value={info.supported ? 'أيوه' : 'لأ'} good={info.supported} />
      <Row label="عدد الأصوات على الجهاز" value={info.count} good={info.count > 0} />
      <Row label="صوت روماني" value={info.ro ?? 'مش موجود'} good={!!info.ro} />
      <button type="button" onClick={() => speak('Bună ziua! Eu sunt Ursu.')} className="mt-3 w-full rounded-xl bg-leaf text-white font-bold py-3">
        جرّب: «Bună ziua! Eu sunt Ursu.»
      </button>
      {!ok && (
        <div className="mt-3 rounded-xl bg-berry/10 p-3 leading-relaxed">
          <p className="font-semibold mb-1">عشان الصوت يشتغل:</p>
          <VoiceFixSteps />
        </div>
      )}
      <p className="mt-2 text-xs text-bark/50">لو لسه مش شغال، خد سكرين شوت للمربع ده وابعته.</p>
    </section>
  );
}
