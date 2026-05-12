# DircBot v8.11 — Chat→Projekt + Daily-Plan-History + Topic-Highlights

## 🎯 Was neu ist in v8.11

### 1. 📂 Chats in Projekte verschieben
Auf jedem Chat-Eintrag in der Sidebar erscheint im Hover ein **Ordner-Icon** (zwischen Title und Delete). Klick → Popup-Menü mit:
- **"Kein Projekt (entfernen)"** — falls Chat aktuell in einem Projekt ist
- Liste aller Projekte (mit farbigem Dot)
- Aktuelles Projekt mit ✓ markiert

Klick auf einen Eintrag verschiebt den Chat sofort und der **Projekt-Farbpunkt** erscheint klein neben dem Chat-Title als visueller Indikator.

So kannst du auch alte Chats nachträglich in Projekte sortieren.

### 2. 📅 Daily-Plan-Verlauf — Bot baut auf gestern auf

**Was passiert beim Klick auf "Hol meinen Plan":**
1. System merkt sich: User generiert gerade einen Daily-Plan für Topic X
2. **Vorherige Pläne (letzte 7 Tage)** werden in die Frage injiziert
3. Bot sieht: "User hat gestern das gemacht, vor 2 Tagen jenes" → baut darauf auf
4. Antwort wird automatisch in `userProfile.dailyPlans` gespeichert

**Was du im Widget siehst:**
- **🔥 Streak-Badge** (z.B. "🔥 5") wenn du 5 Tage in Folge einen Plan gemacht hast
- **"Heutiger Plan steht"** wenn schon ein Plan für heute existiert → Button wird "Plan updaten"
- **"Baut auf deinen letzten 7 Tagen auf"** als Hinweis-Text
- **"Verlauf ansehen →"** Button öffnet Modal mit allen Plänen

**Modal:** Chronologische Liste aller Pläne, je mit Datum, Topic-Farbe, Zusammenfassung.

**Storage:** `userProfile.dailyPlans` Array (max 30 Einträge, FIFO).

### 3. 🔥 Heute-Highlight pro Topic
Beim Klick auf ein Topic erscheint nun **ZUERST eine Highlight-Card** über den normalen Suggestion-Cards:

```
┌─[Topic-Color Border]──────────────────────┐
│ 🔥 HEUTE AKTUELL                          │
│ Schweizer Legal-Framework führt           │
│ weltweit bei Tokenisierung.               │
│ ┌────────────────────────────────────┐    │
│ │ ACTION: Wenn du baust: explorer   →│    │
│ │ das DLT-Gesetz. 30min Reading.    │    │
│ └────────────────────────────────────┘    │
└───────────────────────────────────────────┘
```

Rotiert täglich (deterministisch per Tag-des-Jahres) — jedes der 10 Topics hat 7 Highlights, also alle 7 Tage andere.

Klick auf Action-Button → schickt direkt die "Hilf mir das anzugehen" Frage an den Bot mit dem konkreten Action-Text.

---

## 🚀 Upload + Test

1. GitHub: 39 Files (keine neuen Files diesmal)
2. Auto-Deploy + Hard-Refresh

### Test-Flow
1. **Chat verschieben**: Hover über einen Chat in Sidebar → Ordner-Icon erscheint → klick → Projekt wählen → Farbpunkt erscheint am Chat ✓
2. **Daily-Plan-History**: 
   - Daily Focus → "Hol meinen Plan" → Bot antwortet → Antwort wird gespeichert
   - Widget zeigt jetzt 🔥 1 (Day-Streak)
   - Beim nächsten Klick injiziert er den letzten Plan in die Frage
   - Bot antwortet im Stil "Gestern hast du X gemacht — heute ist der nächste Schritt..."
   - "Verlauf ansehen" → Modal mit allen Plänen
3. **Heute-Highlight**: Klick auf Topic in Top-Bar → Highlight-Card erscheint mit Tagestipp + Action ✓

---

## 📁 Files v8.11 (39 total)

Keine neuen Files. Modified:
- `assets/profile.js` — Daily-Plan-History (Save/Load/Modal), Chat-Move (Menu/Function), Streak-Badge
- `assets/app.js` — Topic-Highlight Card in renderTopicSuggestions, pendingDailyPlan flag + save
- `assets/style.css` — Highlight-Card CSS, Move-Menu CSS, Streak-Badge CSS, History-Modal CSS, Chat-projDot CSS
