# DircBot v8.4 — Auto-Memory + Equinat-Style Layout

## 🎯 Was neu ist in v8.4

### Layout-Redesign (wie Equinat)
- **Kein "Chat-Card" mehr** — der Bot ist jetzt **full-width app-shell** im Tester-Mode, nicht mehr eine kleine Box auf dunklem Hintergrund
- **Sticky Top-Header** mit Bot-Name + Status + Counter (immer sichtbar beim Scrollen)
- **Dünne Progress-Bar** direkt unterm Header
- **Zentriertes Welcome-State** wenn noch kein Chat läuft: großes "D"-Avatar, Heading, Sub-Text, 4 Suggestion-Cards im 2×2 Grid (genau wie Equinat's PferdeBot Welcome)
- **Sticky Bottom-Input** — Input-Bar bleibt immer unten, scrollt nicht weg
- **Im Free-Mode** unverändert (3 Free-Messages mit Hero etc.)

### Auto-Memory (lernt automatisch!)
- **Kein "Merken"-Button-Klick mehr nötig** — der Bot lernt eigenständig
- Während dem Chat extrahiert der Bot wichtige Fakten über dich (Ziele, Business-Stage, Team-Size, MRR, Industry etc.) und speichert sie still im Hintergrund
- Soft-Toast "+1 Memory saved" kurz zur Bestätigung
- Im **Profil-Modal** siehst du jetzt "🧠 Was DircBot über dich weiß" — alle gelernten Memories, **direkt editierbar** (Click & Type), einzeln löschbar mit ✕, oder "Alle löschen"
- Bot bekommt diese Memories bei jeder Folgefrage als Kontext → Antworten werden über Sessions hinweg immer personalisierter
- Max 30 Memories (FIFO), dedupliziert
- "Merken"-Button bleibt als optionales Backup für Insights die du händisch pinnen willst

### Technisch
- System-Prompt instruiert Bot, optional `<<MEMORY>>...<<END_MEMORY>>` Block am Ende seiner Antwort zu emittieren
- Frontend strippt den Block vor der Anzeige, parsed die Bullet-Lines, speichert dedup'd ins Profil
- Profil-Memory wird bei jedem `/chat` Call als `userMemories`-Block in den System-Prompt injiziert

---

## 🚀 Upload-Schritte (gleicher Flow wie immer)

1. GitHub: dircbot-v8 Inhalt überschreiben (35 Files)
2. Commit: `v8.4: Equinat-style layout + auto-memory`
3. Auto-Deploy
4. Hard-Refresh (`Cmd+Shift+R`)

**Wichtig:** Die Env Vars `ANTHROPIC_API_KEY`, `NETLIFY_API_TOKEN`, `ADMIN_API_PASS` sollten alle schon gesetzt sein von v8.2/v8.3.

---

## ✅ Test-Flow

1. `dircbotDebug.reset()` → frisch starten
2. 3 Free-Messages → Wall → DIRC500 → Profile-Modal poppt auf
3. Profile anlegen → **Neuer Layout sollte erscheinen**:
   - Oben: Header-Bar "DircBot · Online · 8 KI-Modelle aktiv" mit Counter rechts
   - Drunter: Dünne Progress-Bar
   - Mitte: Großes "D"-Logo + "Hey — ich bin DircBot" + Sub + 4 Suggestion-Cards (2×2)
   - Unten: Input-Bar sticky
4. Click auf eine Welcome-Card → Welcome verschwindet, Chat startet
5. Erzähl dem Bot was Persönliches: "Ich baue gerade ein SaaS für HR-Teams in München, MRR ist bei 12k"
6. Nach Bot-Antwort: Toast "🧠 +2 memories saved" oben
7. Profil-Card in Sidebar klicken → Modal → Section "🧠 Was DircBot über dich weiß" zeigt die gespeicherten Memories
8. Im selben Chat: Frag "Was würdest du für meine nächsten 90 Tage empfehlen?" → Bot referenziert das SaaS und die 12k MRR

---

## 📁 Files v8.4 (35 total)

```
dircbot-v8/
├── INSTALL.md                              ← diese Datei
├── index.html                              ← welcome-state + memory-section markup
├── tester-signup.html, admin.html
├── impressum.html, datenschutz.html, nutzungsbedingungen.html
├── netlify.toml, package.json, .env.example, .gitignore
│
├── assets/
│   ├── topics.js                           ← 10 topics + daily tips
│   ├── profile.js                          ← +extractMemoryBlock, saveAutoMemories, renderMemoriesList
│   ├── app.js                              ← wired memory extraction; rebuilt welcome state
│   ├── style.css                           ← +Equinat-style tester layout (~400 neue Zeilen)
│   ├── admin.js, admin.css
│   ├── tester-signup.css, legal.css, consent.js
│   └── dirc_logo.svg, dirc_portrait_sharp.jpg
│
├── knowledge-base/                         ← 11 KB files
│
└── netlify/functions/
    ├── chat.js                             ← +AUTO-MEMORY PROTOCOL instructions
    └── admin-submissions.js
```

---

## 🐛 Troubleshooting

**Welcome-State zeigt sich nicht zentriert**
→ Browser muss `:has()` CSS unterstützen. Chrome/Safari/Edge/Firefox aktuelle Versionen tun das. Bei ganz altem Browser fällt es auf Top-aligned zurück (nicht schlimm).

**"Memory saved" Toast erscheint nicht obwohl ich was Persönliches erzählt hab**
→ Bot entscheidet was er für memorierenswert hält. Wenn die Aussage zu generisch war (z.B. "ich mag Crypto") emittiert er KEINEN MEMORY-Block. Probier was Konkretes: "Ich bin Solopreneur in Deutschland mit 8k MRR aus meinem SaaS".

**Memories im Profil-Modal weg**
→ Browser-Storage gelöscht? `localStorage.getItem('dircbot-profile')` prüfen in DevTools.

**Layout sieht im Free-Mode komisch aus**
→ Free-Mode-Layout sollte unverändert sein. Nur Tester-Mode hat das neue App-Shell. Wenn doch was kaputt ist → Screenshot.

**Im Profile-Modal überspringe ich erst, dann editiere ich später — Memories werden nicht gespeichert**
→ Wenn kein Profil existiert (nur "skip" gedrückt) wird beim ersten Memory-Emit automatisch ein minimales Profil mit Name "Tester" angelegt. Du kannst es dann später bearbeiten.

---

Bei Bugs: Screenshot, ich seh's. 🔥
