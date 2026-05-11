# DircBot v8.2 — Profile + Memory + Chat-Verlauf + Live Submissions

## 🎯 Was neu ist in v8.2

### Tester-Wall redesigned
- **Primary CTA:** "Apply as Beta Tester" → leitet auf `/tester-signup` (großer orange Button)
- **Secondary:** Kleines Eingabefeld für bereits freigeschaltete Tester (ohne DIRC500-Hint)
- Klare Trennung mit "Already approved?" Divider

### Profile-System (wie Equinat's Pferd-Profile)
- Beim ersten Tester-Code-Eintritt: **Profile-Modal** öffnet sich automatisch
- Felder: Name (Pflicht), Hauptziel (Pflicht), Schwerpunkt-Topic, Business-Stage, Top 3 Prioritäten
- Profil-Card sichtbar in Sidebar — Click → Bearbeiten
- Bot bekommt das Profil als Kontext und antwortet personalisiert ("Anna, basierend auf deinem Solopreneur-Status...")

### Memory-System
- Neuer **"Merken" Button** unter jeder Bot-Antwort (Stern-Icon, nur im Tester-Mode mit Profil)
- Klicken → Antwort wird im Profil als Memory gespeichert (max 20)
- Bei jedem Future-Call gibt Bot Memories als zusätzlichen Kontext mit
- Memory bleibt zwischen Sessions

### Daily Focus Widget
- Sidebar oben: **"✦ Today's Focus"** Card mit täglich rotierendem Tip + Action
- Basiert auf Profile-Focus-Area (oder rotiert durch alle 8 Topics nach Wochentag)
- 7 Tipps pro Topic = 1 für jeden Tag der Woche
- "Mit DircBot besprechen" Button → öffnet neuen Chat mit dem Topic + Frage

### Chat-Verlauf
- Sidebar zeigt **"Meine Chats"** Section unten
- Jede Conversation wird automatisch gespeichert (Title = erste User-Message)
- Gruppiert: Heute · Diese Woche · Älter
- Click → Chat wieder laden, weitermachen wo man aufgehört hat
- Hover → Delete-Button
- Max 100 Chats (älteste werden überschrieben)

### Live Submissions im Admin
- Admin-Panel hat jetzt einen **"📬 Tester-Bewerbungen"** Bereich
- Lädt direkt aus Netlify Forms API (alle Forms, alle Submissions)
- Jede Bewerbung als Card mit:
  - Name, Email, Telegram, Instagram, Land, Interesse, Herausforderung, Motivation
  - Status-Badge (NEU / FREIGESCHALTET / ABGELEHNT)
  - **"✓ Welcome-Email"** Button: Pre-fill Email-Generator, generiert Code-Email, markiert als Approved
  - **"💬 Telegram öffnen"** Button: Deep-Link zum Telegram-Chat
  - **"📋 Email kopieren"** Button: Email in Zwischenablage
  - **"✕ Ablehnen"** Button

---

## ⚠️ ZWEI ENV VARS NÖTIG für die Live-Submissions

Das Admin-Panel braucht **2 neue Environment-Variables** auf Netlify:

### 1. `NETLIFY_API_TOKEN`
Zugriff auf Netlify Forms API.

**So bekommst du den Token:**
1. Geh auf https://app.netlify.com/user/applications
2. Scroll zu "Personal access tokens"
3. Klick **"New access token"**
4. Name: "DircBot Admin"
5. Description: "Read forms for admin panel"
6. Klick "Generate token"
7. **Kopier den Token sofort** (wird nur einmal angezeigt!)

### 2. `ADMIN_API_PASS`
Schützt die Admin-Function von missbrauch. Wähl ein starkes Passwort, z.B. `dirc-admin-2026-secret-x9k2`

**Beide hinzufügen:**
1. Netlify → Site Settings → Build & deploy → Environment variables
2. **Add a variable** für jedes:
   - Key: `NETLIFY_API_TOKEN`, Value: dein-token-von-oben
   - Key: `ADMIN_API_PASS`, Value: dein-starkes-passwort
3. Save
4. Trigger redeploy (Deploys → Trigger deploy)

**Wichtig:** Diese Passwörter sind anders als das `ADMIN_PASSWORD` in `assets/admin.js`:
- `ADMIN_PASSWORD` (in JS): Schützt den Admin-Panel-Login → `dirczahlmann2026`
- `ADMIN_API_PASS` (Env Var): Schützt die Submissions-API → wird beim ersten "Bewerbungen laden" abgefragt
- `NETLIFY_API_TOKEN` (Env Var): Wird intern benutzt, nicht angefasst

---

## 🚀 Upload (gleiche Schritte wie immer)

1. GitHub: https://github.com/dirczahlmann/dircbot
2. "Add file" → "Upload files" → ALLES aus `dircbot-v8/` reinziehen (32 Files)
3. Commit: `v8.2: Profile + memory + chat history + live submissions`
4. Netlify deployed in ~2 Min
5. **Environment Variables setzen** (siehe oben — ohne klappt "Bewerbungen laden" im Admin nicht)
6. Hard-Refresh im Browser: `Cmd+Shift+R`

---

## ✅ Test-Flow

1. `dircbotDebug.reset()` in Console → Frischer Start
2. 3 Free-Messages testen → Wall sollte primär **"Apply as Beta Tester"** zeigen
3. Code `DIRC500` ins Secondary-Feld eingeben → Tester-Mode + **Profile-Modal poppt auf**
4. Profile anlegen: Name "Test", Goal "100k MRR", Focus "Sales" → speichern
5. Sidebar checken: Daily Focus oben + Profile Card + Topics + Chats unten
6. Frage stellen → Bot antwortet personalisiert mit Namen
7. Auf der Antwort: "Merken" klicken → Memory gespeichert
8. Neue Frage → Bot referenziert die Memory
9. "New Chat" klicken → fresh start, alter Chat in Sidebar
10. Alten Chat in Sidebar anklicken → lädt sich wieder

---

## 📁 Files v8.2

```
dircbot-v8/
├── INSTALL.md                              ← Diese Datei
├── index.html                              ← Updated: Sidebar v2, Profile Modal, Wall redesign
├── tester-signup.html                      (unchanged)
├── admin.html                              ← Updated: Live submissions section
├── impressum.html, datenschutz.html, nutzungsbedingungen.html
├── netlify.toml, package.json, .env.example, .gitignore
│
├── assets/
│   ├── topics.js                           ← Extended: +Daily Tips, getDailyTip()
│   ├── profile.js                          ← NEU: Profile, Memory, History, Daily
│   ├── app.js                              ← Updated: Hooks für profile/history/memory
│   ├── style.css                           ← Extended: +600 Lines neue UI
│   ├── admin.js                            ← Extended: +loadSubmissions, render, actions
│   ├── admin.css                           ← Extended: +submission cards CSS
│   ├── tester-signup.css                   (unchanged)
│   ├── legal.css, consent.js               (unchanged)
│   ├── dirc_logo.svg, dirc_portrait_sharp.jpg
│
├── knowledge-base/                         (unchanged)
│
└── netlify/functions/
    ├── chat.js                             ← Updated: userContext + userMemories
    └── admin-submissions.js                ← NEU: fetch from Netlify Forms API
```

---

## 🐛 Troubleshooting

**"Bewerbungen laden" zeigt Fehler "NETLIFY_API_TOKEN not configured"**
→ Env Variable noch nicht gesetzt. Schritt 2 oben prüfen.

**"Unauthorized" beim Submissions-Laden**
→ Falsches ADMIN_API_PASS eingegeben. Browser: `sessionStorage.removeItem('dircbot-admin-api-pass')` → Reload → richtiges PW eintippen.

**Profile-Modal poppt nicht auf nach Tester-Code-Eingabe**
→ Schon ein Profil im localStorage. `localStorage.removeItem('dircbot-profile')` + Reload.

**Chat-Verlauf wird nicht gespeichert**
→ Inkognito-Modus? localStorage geht da nicht. Normaler Browser nutzen.

**Daily Focus zeigt nichts**
→ Wahrscheinlich vor `topics.js` geladen. Reload nochmal.

---

**Bei Bugs:** Screenshot in den Chat, ich seh's. 🔥
