# كلمات · Kelimat

A mobile-first PWA that teaches everyday Romanian to Arabic speakers living in Romania. The whole UI is in Arabic (RTL). The mascot is **Ursu** (أورسو), a small bear.

## Run

```bash
npm install
npm run dev        # http://localhost:5173 (also on your LAN, so you can open it on your phone)
npm run build && npm run preview   # production build + service worker (offline / installable)
npm test           # spaced-repetition, streak and level logic
npm run check:content   # validate scenarios.json and count unreviewed entries
npm run icons      # regenerate app icons from src/components/Ursu.jsx
```

## Content: `src/data/scenarios.json`

6 scenarios (supermarket, university, train, doctor, renting, work). Each has:

- `items` (15): `ro`, `ar`, `pron` (pronunciation in Arabic script), `example: { ro, ar }`, `verified`
- `phrases` (7): full sentences for "كيف أقولها؟": `ro`, `ar`, `pron`, `verified`

Every entry starts with `"verified": false`. Set it to `true` once you have checked it. `npm run check:content` shows how many are left.

Pronunciation conventions (also shown in the app under تقدّمي): ă → ـَ, â/î → ـِ, ș → ش, ț → تس, ce/ci → تش,
che/chi → ك, ge/gi → ج, other g → گ, j → ژ, p → پ, v → ڤ, word-initial e → يِـ.

## How learning works

- **Flashcards**: tap to flip, 🔊 normal / 🐢 slow audio (Web Speech API, `ro-RO`), then "عارفها" or "لسه".
- **Spaced repetition** (`src/lib/srs.js`): Leitner boxes 0–5 with intervals 0/1/3/7/14/30 days.
  "عارفها" moves a card up a box. "لسه" drops it to box 0, so it is due again right away, and puts it back 3 cards later in the same session.
- **Streak and levels** (`src/lib/progress.js`): one review per day keeps the streak. XP: 10 for "عارفها", 5 for "عارفها" after a miss, 2 for "لسه". There are 7 levels.
- Everything is saved in `localStorage` under the key `kelimat:v1`.

Audio quality depends on the device having a Romanian voice. The app shows a notice when it doesn't.

## Install on a phone

Live at **https://mohamed120055.github.io/bc-v2/** (GitHub Pages, served from the `gh-pages` branch).
To publish changes, run `npm run deploy`. It builds the app and pushes `dist/` to `gh-pages`.

- Android (Chrome): open the link and tap "ثبّت الآن" in the app, or use the menu ⋮ → Install app.
- iPhone (Safari): Share ⬆︎ → Add to Home Screen.
