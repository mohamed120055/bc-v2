import { isAndroid, isIOS, isSamsungBrowser } from '../lib/device.js';

/** Platform-specific steps to get Romanian speech working. */
export default function VoiceFixSteps() {
  if (isIOS()) {
    return (
      <ol className="list-decimal ps-5 space-y-1">
        <li>تأكد إن مفتاح الصامت 🔕 على جنب الآيفون مقفول، وإن الصوت عالي.</li>
        <li>الإعدادات ← تسهيلات الاستخدام ← المحتوى المنطوق ← الأصوات ← <b>الرومانية (Română)</b> ← نزّل صوت.</li>
        <li>اقفل التطبيق خالص وافتحه تاني.</li>
      </ol>
    );
  }
  if (isAndroid()) {
    return (
      <ol className="list-decimal ps-5 space-y-1">
        {isSamsungBrowser() && <li>افتح التطبيق من <b>Google Chrome</b> بدل متصفح سامسونج.</li>}
        <li>علّي صوت <b>الميديا</b> (مش صوت الرنة).</li>
        <li>الإعدادات ← ابحث عن <b>«تحويل النص إلى كلام»</b> ← المحرك المفضّل: <b>Google</b>.</li>
        <li>اضغط ⚙️ جنب Google ← <b>تثبيت بيانات الصوت</b> ← <b>Română</b> ← نزّلها.</li>
        <li>لو مش لاقي Google: نزّل <b>«Speech Recognition & Synthesis»</b> من Play Store.</li>
        <li>اقفل التطبيق خالص وافتحه تاني.</li>
      </ol>
    );
  }
  return (
    <ol className="list-decimal ps-5 space-y-1">
      <li>علّي صوت الجهاز.</li>
      <li>جرّب متصفح Chrome أو Edge أو Safari.</li>
      <li>ثبّت صوت اللغة الرومانية من إعدادات النظام (تحويل النص إلى كلام).</li>
    </ol>
  );
}
