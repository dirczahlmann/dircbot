# DircBot v8.6 — Layout-Bugfixes + Memory-Confirmation + Profile-Erweiterung

## 🎯 Was neu ist in v8.6

### Bugfixes (kritisch)
- **Layout-Bug: Bot-Antworten erschienen nebeneinander statt untereinander** → fixed (welcome-state wird jetzt aus DOM entfernt, nicht nur hidden — der `:has()` Selector hat sonst weiter gematched und chat-body in flex-center belassen)
- **TESTER-MODUS Badge überlappte Counter** → fixed (counter pill hat jetzt margin-right: 320px statt 200px, badge wird auf <1100px screens komplett ausgeblendet)
- **Scrolling bei langen Antworten** → fixed (chat-body hat jetzt explizites `min-height:0; max-height:none; padding-bottom:80px` damit lange Antworten scrollen können ohne hinter dem sticky Input zu verschwinden)
- **Scrollbar** → sichtbarer (orange-tinted statt grau)

### Memory mit User-Bestätigung
Statt stiller Speicherung jetzt **Inline-Confirmation-Chips**:
- Bot lernt einen Fakt → Memory wird gespeichert
- Direkt unter der Bot-Antwort erscheint ein lila Chip: **"🧠 Gemerkt: [text]   ✕"**
- User kann mit ✕ klick die Memory **sofort wieder entfernen** wenn falsch interpretiert
- Bleibt sichtbar bis User explizit verwirft oder die Seite neu lädt
- Memories sind weiterhin im Profil editierbar/löschbar

### Profile-Erweiterung
Zwei neue Felder im Profil-Modal:
- **"Was du beruflich machst"** (`currentJob`) — z.B. "Selbstständiger Crypto-Berater"
- **"Möchte besser werden in"** (`improvementGoal`) — z.B. "High-Ticket Closing"

Beide werden in den USER PROFILE-Block des System-Prompts injiziert → der Bot referenziert sie aktiv in seinen Antworten und im Daily Focus.

### Daily Focus → personalisiert
Wenn du auf "Mit DircBot besprechen" klickst, wird jetzt **nicht mehr** ein generischer Tip an den Bot geschickt, sondern eine **kontext-injizierte Frage**:

> "Mit meinem Kontext (Ziel: 1.5M Haus in 12 Monaten; ich mache aktuell: Crypto-Berater; will besser werden in: High-Ticket Closing; Stage: side-hustle) — was ist das EINE wirkungsvollste das ich HEUTE im Bereich Crypto & Blockchain angehen sollte um meinem Ziel näher zu kommen?"

→ Bot gibt jetzt einen **wirklich relevanten** 3-Schritte-Plan für DEINE Situation, statt generisch "lies das DLT-Gesetz 30 Minuten".

---

## 🚀 Upload + Test

1. GitHub: dircbot-v8 hochladen (36 Files)
2. Commit: `v8.6: Layout fix + memory confirm + profile fields`
3. Auto-Deploy
4. **Hard-Refresh** (`Cmd+Shift+R`) — sonst werden die alten JS-Files gecacht

### Test-Flow
1. `dircbotDebug.reset()` → frisch
2. 3 Free-Messages → DIRC500 → **Erweiteres Profile-Modal** mit neuen Feldern
3. Fülle alles aus inkl. "Beruf" und "Verbesserungsziel"
4. **Welcome-State** wird zentriert angezeigt
5. Stelle eine längere Frage → Bot antwortet → **Antworten erscheinen UNTEREINANDER** (kein 3-Spalten-Layout mehr)
6. Erzähl was Persönliches → Memory-Chip erscheint **unter** der Antwort mit ✕-Button
7. Falsch interpretierte Memory? ✕ klicken → verschwindet sofort
8. Klick **"Mit DircBot besprechen"** auf Daily Focus → Bot bekommt personalisierte Frage → relevante Antwort für deine Situation
9. **Counter oben** ist sichtbar, **TESTER-MODUS** ist klar daneben, **Verbleibende Nachrichten unten** ist weg

---

## 📁 Files v8.6 (36 total)

Keine neuen Files, nur Updates:
- `assets/app.js` — welcome.remove() statt display:none, renderMemoryChips()
- `assets/profile.js` — saveAutoMemories returns added, removeMemoryByText, new profile fields, personalized daily focus
- `assets/style.css` — has-welcome class, memory chips, counter margin, scroll fixes
- `index.html` — has-welcome initial class, new profile fields (Job + Improvement)

