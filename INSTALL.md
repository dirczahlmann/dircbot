# DircBot v8.9 — Cleanup: keine doppelten Topics + cleaneres Signup-Hero

## 🎯 Was neu ist in v8.9

### 1. ❌ Horizontale Topic-Chips-Bar oben ENTFERNT
Vorher (v8.8): Topics doppelt — sidebar UND horizontale Chips oben. Auf großen Screens überfluteten die Chips den Header.

Jetzt: Topics nur noch in der **Sidebar links** (die ist seit v8.7 sowieso fixed-top, verschwindet also nicht mehr beim Scrollen). Saubere, einheitliche UX.

### 2. ❌ DIRCBOT-Logo aus Signup-Hero ENTFERNT
Vorher (v8.8): DIRCBOT-Logo als Header-Brand + Cyber-Suit-Dirc mit Logo auf der Brust = doppelt.

Jetzt: Nur noch **Cyber-Suit-Dirc** im Hero (Logo ist eh auf der Brust). Cleaner, fokussierter, kein "zu viel".

### 3. ✨ Cyber-Suit-Dirc prominenter gemacht
Da der Cyber-Suit jetzt das einzige Markenelement im Hero ist:
- max-height: 560px → **640px** (größer)
- Drop-Shadow intensiver (von 25/0.25 → 30/0.3)
- Glow-Effekt im Hintergrund ausgeweitet (75% → 85% area, blur 40 → 50px)
- Mehr visuelle Präsenz

DIRCBOT-Logo bleibt im Chat-Welcome-State erhalten (dort funktioniert es als Brand-Statement gut, da kein Cyber-Suit konkurriert).

---

## 🚀 Upload + Test

1. GitHub: 38 Files
2. Auto-Deploy + Hard-Refresh

### Test-Flow
1. Chat-Page: **keine Chip-Leiste** mehr oben — Topics nur in Sidebar links ✓
2. Sidebar bleibt fixed-top → Topics immer sichtbar ✓
3. `tester-signup.html`: nur Cyber-Suit-Dirc rechts, KEIN Extra-Logo ✓
4. Cyber-Suit-Dirc größer/prominenter, mit stärkerem Glow ✓

---

## 📁 Files v8.9 (38 total — unverändert)

Modified:
- `index.html` — topic-chips-bar div entfernt
- `assets/app.js` — renderTopicChips() entfernt, selectTopic/clearTopic sync nur noch sidebar
- `assets/style.css` — Komplette V8.8 Chip-CSS-Section entfernt (~1960 chars)
- `tester-signup.html` — signup-hero-brand div entfernt
- `assets/tester-signup.css` — brand CSS-rules entfernt, Cyber-Suit Image prominenter

