import { useEffect, useState } from 'react';
import { isIOS } from '../lib/device.js';

const standalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
const DISMISS_KEY = 'kelimat:install-dismissed';

/** Offers "install as app": a real button on Android/Chrome, instructions on iPhone Safari. */
export default function InstallBanner() {
  const [prompt, setPrompt] = useState(null);
  const [hidden, setHidden] = useState(() => {
    try { return standalone() || localStorage.getItem(DISMISS_KEY) === '1'; } catch { return standalone(); }
  });

  useEffect(() => {
    const onPrompt = (e) => { e.preventDefault(); setPrompt(e); };
    const onInstalled = () => setHidden(true);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => { window.removeEventListener('beforeinstallprompt', onPrompt); window.removeEventListener('appinstalled', onInstalled); };
  }, []);

  if (hidden || __SHARE_BUILD__ || (!prompt && !isIOS())) return null;

  const dismiss = () => { setHidden(true); try { localStorage.setItem(DISMISS_KEY, '1'); } catch { /* ignore */ } };

  return (
    <div className="rounded-2xl bg-sky text-white p-4 shadow-md flex items-start gap-3 pop">
      <span className="text-2xl" aria-hidden>📲</span>
      <div className="flex-1 text-sm leading-relaxed">
        <div className="font-bold text-base">ثبّت كلمات على موبايلك</div>
        {prompt ? (
          <span>يفتح زي أي تطبيق، ويشتغل من غير إنترنت.</span>
        ) : (
          <span>في Safari: اضغط زر المشاركة <b>⬆︎</b> تحت، ثم <b>«إضافة إلى الشاشة الرئيسية»</b>.</span>
        )}
        <div className="mt-2.5 flex gap-2">
          {prompt && (
            <button type="button" className="rounded-xl bg-white text-sky font-bold px-4 py-2"
              onClick={async () => { prompt.prompt(); const r = await prompt.userChoice; if (r.outcome === 'accepted') setHidden(true); setPrompt(null); }}>
              ثبّت الآن
            </button>
          )}
          <button type="button" className="rounded-xl bg-white/20 font-semibold px-4 py-2" onClick={dismiss}>مش دلوقتي</button>
        </div>
      </div>
    </div>
  );
}
