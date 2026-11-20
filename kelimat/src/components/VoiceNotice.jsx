import { useVoiceStatus } from '../lib/useVoice.js';

export default function VoiceNotice() {
  const status = useVoiceStatus();
  if (status === 'ro') return null;
  return (
    <p className="rounded-xl bg-berry/10 text-bark text-sm px-3 py-2 leading-relaxed">
      {status === 'unsupported'
        ? '🔇 متصفحك لا يدعم النطق الصوتي. جرّب Chrome أو Safari.'
        : '🔈 لا يوجد صوت روماني على جهازك، فقد يكون النطق غير دقيق. يمكنك إضافة صوت "Română" من إعدادات الجهاز (تحويل النص إلى كلام).'}
    </p>
  );
}
