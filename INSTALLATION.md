# 🔥 DircBot v2 — Test-Deployment (parallel zum Live-Bot)

## 🎯 Was diese Version macht

Eine **komplette, deploy-ready Version** des DircBot mit allen Updates:

✅ Logo oben links + im Footer
✅ DSGVO-konformer Cookie-Banner
✅ 3 Legal-Seiten (Impressum, Datenschutz, Nutzungsbedingungen)
✅ AI-Disclaimer im Footer (EN/DE/ES)
✅ Bilingual EN/DE/ES mit Sprach-Toggle
✅ Foto/PDF-Upload für Bot-Analyse
✅ Echte Bot-Logik via Claude API
✅ Wissensdatenbank als Markdown
✅ Email-Lead-Capture
✅ Brand-Update: alle Links auf `dirczahlmann.com`

---

## 🚀 Deployment-Strategie: Parallel-Test

Dein **aktueller Bot bleibt live**. Der neue läuft daneben als Test.

```
LIVE (bestehend):  dircbot.netlify.app      ← bleibt, läuft weiter
TEST (neu):        dircbot-v2.netlify.app   ← dieser hier
```

Wenn der neue besser performt → später umbenennen oder Custom-Domain umstellen.

---

## 📋 Schritt-für-Schritt (15 Min)

### SCHRITT 1 — Neues GitHub Repo erstellen (2 Min)

⚠️ **Wichtig:** Ein **NEUES** Repo, nicht das bestehende `dircbot` Repo überschreiben!

1. Geh auf **github.com/new**
2. Repository name: `dircbot-v2` (oder `dircbot-new` / `dircbot-test`)
3. Privat oder Public — egal
4. ⚠️ **NICHT** "Add README" anhaken
5. **Create Repository**

### SCHRITT 2 — Code uploaden (3 Min)

1. ZIP `dircbot-final.zip` auf deinem Mac entpacken
2. Auf der leeren GitHub-Repo-Seite → klick **"uploading an existing file"**
3. Drag den **gesamten Inhalt** des entpackten Ordners (alle Files + Folders) ins Browser-Fenster

⚠️ **Wichtig:** Den **Inhalt** vom `dircbot-final/` Ordner ziehen, NICHT den Ordner selbst.

Du solltest in GitHub sehen:
- `index.html`, `impressum.html`, `datenschutz.html`, `nutzungsbedingungen.html`
- `package.json`, `netlify.toml`, `.gitignore`, `.env.example`
- `assets/` Ordner mit 5 Files
- `knowledge-base/` Ordner mit 8 Files
- `netlify/functions/` Ordner mit `chat.js`

⚠️ **Hidden Files (.gitignore, .env.example):** Falls die nicht mit drag-and-dropped wurden:
- Mac Finder: Cmd+Shift+. (Punkt) → versteckte Files sichtbar machen
- Dann nochmal hochladen

4. Commit message: `Initial commit — DircBot v2 with legal & branding`
5. **Commit changes**

### SCHRITT 3 — Netlify Site erstellen (3 Min)

⚠️ Du erstellst eine **NEUE** Netlify Site — der alte Bot bleibt unangetastet.

1. **app.netlify.com** → **Add new site** → **Import an existing project**
2. **Deploy with GitHub**
3. Wähl dein neues `dircbot-v2` Repo
4. Build settings: alles auf Standard lassen
5. **Deploy site**

Du bekommst eine neue URL wie `random-name-xyz.netlify.app`.

### SCHRITT 4 — API Key hinzufügen (2 Min)

1. Netlify Dashboard → dein **neues** Projekt → **Site configuration**
2. **Environment variables** → **Add a variable**
3. Key: `ANTHROPIC_API_KEY`
4. Value: dein bestehender Anthropic API Key (mit Guthaben)
5. **Create variable**
6. **Deploys** → **Trigger deploy** → **Deploy site**

### SCHRITT 5 — Netlify Subdomain umbenennen (1 Min)

1. **Site configuration** → **Site information** → **Change site name**
2. Wähl: `dircbot-v2` oder `dircbot-test` oder `dircbot-new`
3. → wird zu `dircbot-v2.netlify.app`

### SCHRITT 6 — Testen ✅

1. Öffne die neue URL
2. Hard refresh: **Cmd+Shift+R**
3. Check-Liste:
   - ✅ Logo oben links sichtbar?
   - ✅ Cookie-Banner unten beim ersten Besuch?
   - ✅ Sprach-Toggle EN/DE/ES funktioniert?
   - ✅ Bot antwortet auf eine Test-Frage?
   - ✅ Footer mit allen Legal-Links?
   - ✅ Klick auf Impressum → korrekte Daten?

---

## 🆚 Vergleich: Alter vs. Neuer Bot

| Feature | Alt | Neu |
|---|---|---|
| Chat-Interface | ✅ | ✅ |
| Bilingual EN/DE | ✅ | ✅ |
| **Spanisch (ES)** | ❌ | ✅ |
| **Foto/PDF-Upload** | ❌ | ✅ |
| **Logo** | ❌ | ✅ |
| **Cookie-Banner** | ❌ | ✅ |
| **Legal Pages** | ❌ | ✅ |
| **AI-Disclaimer** | ❌ | ✅ |
| **Academy-CTA** | ❌ (n3xus) | ✅ |
| **Footer mit Links** | ❌ | ✅ |

---

## 💡 Empfohlene Test-Phase

**Woche 1: Soft-Launch**
- Du allein testest auf der neuen URL
- Stell verschiedene Fragen auf allen 3 Sprachen
- Upload ein paar Bilder/PDFs → sieh wie der Bot reagiert
- Prüf alle Legal-Seiten

**Woche 2: Closed Beta**
- 5-10 Vertraute bekommen die neue URL
- Sammel Feedback
- Vergleiche: Welcher Bot konvertiert besser zu Email-Anmeldungen?

**Woche 3: Migration**
- Wenn neu besser ist → Custom Domain umziehen
- Custom Domain `bot.dirczahlmann.com` auf neue Site mappen
- Alten Bot abschalten oder als Backup behalten

---

## 🎯 Was du noch brauchst, bevor du live gehst

### A) E-Mail-Benachrichtigung für Leads
1. Netlify → dein neues Projekt → **Forms**
2. **Settings & usage** → **Form notifications** → **Email notification**
3. Trag deine Email ein

### B) Legal Pages auf dirczahlmann.com (für vollständige Compliance)
Im Footer verlinke ich zu:
- `https://dirczahlmann.com/#legal/refund`
- `https://dirczahlmann.com/#legal/withdrawal`

Falls deine echten URLs anders sind, kann ich die Links anpassen — sag einfach Bescheid.

### C) Bot-Modell evtl. anpassen
In `netlify/functions/chat.js`, Zeile mit `model:`:
- `claude-sonnet-4-6` (Standard — gut & günstig, ~$0.04/Lead)
- `claude-opus-4-7` (klüger, teurer)
- `claude-haiku-4-5-20251001` (schnellster, billigster)

---

## 🔧 Customization Cheat-Sheet

**Anzahl gratis Nachrichten ändern:**
`assets/app.js` → `let messagesLeft = 3;` ← Zahl ändern

**Suggested Questions ändern:**
`assets/app.js` → `suggestedQuestions` Object
Auch im `index.html` die Chip-Buttons anpassen

**Antwortlänge anpassen:**
`netlify/functions/chat.js` → `max_tokens: 1024,`

**Knowledge Base erweitern:**
Neue `.md` Files in `knowledge-base/` Ordner hinzufügen → Commit → Bot kennt das Wissen sofort

---

## 🆘 Troubleshooting

**Bot antwortet nicht:**
- API Key in Netlify Environment Variables prüfen
- Re-deploy: Deploys → Trigger deploy

**Layout sieht kaputt aus:**
- Hard refresh: **Cmd+Shift+R**
- Check ob `assets/` Files wirklich im `assets/` Ordner sind

**Logo wird nicht angezeigt:**
- `dirc_logo.jpg` muss in `assets/` liegen, nicht im Root
- Auf GitHub: klick auf Logo-File → sollte unter `assets/dirc_logo.jpg` sein

**Hidden Files (.gitignore, .env.example) fehlen:**
- Mac Finder: Cmd+Shift+. → versteckte Files sichtbar machen
- Dann nochmal drag & droppen

**Email-Capture funktioniert nicht:**
- Netlify → Forms muss "active" sein
- Nach erster Submission ggf. einmal re-deployen

---

## 📁 Was im ZIP ist

```
dircbot-final/
├── index.html                          ← Haupt-Bot-Seite
├── impressum.html                      ← Impressum (Schweizer Daten)
├── datenschutz.html                    ← DSGVO-konform
├── nutzungsbedingungen.html            ← AI/Crypto-Disclaimer
├── netlify.toml                        ← Netlify-Config
├── package.json                        ← Dependencies
├── .env.example                        ← API-Key-Template
├── .gitignore                          ← Secrets-Schutz
├── INSTALLATION.md                     ← diese Anleitung
│
├── assets/
│   ├── dirc_logo.jpg                   ← dein Logo
│   ├── style.css                       ← Haupt-Styling
│   ├── legal.css                       ← Legal-Pages-Styling
│   ├── app.js                          ← Chat-Logik
│   └── consent.js                      ← Cookie-Banner
│
├── knowledge-base/                     ← Bot-Wissen (Markdown)
│   ├── 00_identity.md
│   ├── 01_sales.md
│   ├── 02_crypto.md
│   ├── 03_scaling.md
│   ├── 04_wealth.md
│   ├── 05_product.md
│   ├── 06_no_go.md
│   └── 07_languages.md
│
└── netlify/
    └── functions/
        └── chat.js                     ← Claude API Backend
```

---

## 🔥 Nach erfolgreichem Test → nächste Features

Sobald der Test-Bot läuft und du happy bist:

1. 🥇 **Topic-Sidebar** wie bei Equinat
   - Blockchain & Crypto
   - Network Marketing
   - Mindset & Leadership
   - Business Build
   - Tokenisierung

2. 🥈 **Erweiterte KB pro Topic** — tiefe Frameworks pro Bereich

3. 🥉 **Conversation Logging** — welche Fragen kommen, wo bricht der Lead ab

4. **Telegram-Variante** statt Email-Capture

5. **Whitelabel** für Helper/Affiliates

---

**Built by Dirc Zahlmann**
8 Unicorns. 30 Jahre Vertrieb. 15 Jahre Crypto.
[dirczahlmann.com](https://dirczahlmann.com)
