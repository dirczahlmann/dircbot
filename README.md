# 🔥 DircBot — Live Demo Site

Wie der Equinat-Bot. Aber für DircBot.

Eine deployable Demo-Seite, auf der Besucher **3 Fragen gratis** an einen echten DircBot stellen können — powered by Claude API und Dircs vollständiger Wissensdatenbank.

---

## 🎯 Features

- ✅ **Live-Chat-Interface** im n3xus-Branding (Orange/Gold/Dunkel)
- ✅ **Trilingual** — Englisch, Deutsch, Spanisch mit Sprach-Toggle
- ✅ **Echte AI-Antworten** via Claude API + deine Wissensdatenbank
- ✅ **Foto-Upload** — User kann Bilder schicken (Screenshots, Charts, Pitch Decks)
- ✅ **PDF-Upload** — User kann Dokumente schicken (Verträge, Business Pläne)
- ✅ **3-Nachrichten-Limit** (frei konfigurierbar) → triggert dann CTA
- ✅ **Email-Capture** über Netlify Forms (kein externer Service nötig)
- ✅ **Direkter Link zu n3xus.de** als finaler CTA

## 📸 Was kann der Bot mit Uploads?

Der Bot ist **multimodal** — er kann Bilder & PDFs analysieren wie Dirc es tun würde:

| Upload | Was der Bot draus macht |
|---|---|
| Screenshot einer Verkaufs-Konversation | Coaching auf die nächste Antwort |
| Pitch Deck (PDF/Image) | Operator-Kritik mit Framework |
| Crypto-Chart | Cycle-Position & DCA-Frame |
| Business Plan (PDF) | Bottleneck identifizieren + nächster Move |
| Foto eines Produkts / Setups | Operator-Read mit Verbesserungen |
| Vertrag / Angebot (PDF) | Key Insights extrahiert + Framework

---

## 🚀 Deployment in 10 Minuten

### Schritt 1 — GitHub Repo erstellen (2 Min)

1. Geh auf [github.com](https://github.com/new)
2. Klick **New Repository**
3. Name: `dircbot-demo` (oder wie du willst)
4. Privat oder Public — egal
5. **NICHT** "Add README" anhaken
6. Klick **Create Repository**

### Schritt 2 — Code uploaden (3 Min)

**Option A — Drag & Drop (einfachste Variante):**
1. Auf der leeren Repo-Seite klick "uploading an existing file"
2. Drag den **gesamten Inhalt** dieses Ordners hinein (alle Files & Folders)
3. Commit message: "Initial commit"
4. Klick **Commit changes**

**Option B — Git Command Line:**
```bash
cd /pfad/zu/diesem/ordner
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/DEIN-USERNAME/dircbot-demo.git
git push -u origin main
```

### Schritt 3 — Netlify verbinden (3 Min)

1. Geh auf [app.netlify.com](https://app.netlify.com)
2. Klick **Add new site** → **Import an existing project**
3. Wähl **Deploy with GitHub**
4. Authorize Netlify falls noch nicht geschehen
5. Wähl dein `dircbot-demo` Repository
6. Lass alle Build-Settings auf Standard (Netlify erkennt `netlify.toml` automatisch)
7. Klick **Deploy site**

⏳ Netlify deployed jetzt automatisch. Dauert ~1-2 Minuten.

### Schritt 4 — API Key hinzufügen (2 Min) ⚠️ WICHTIG

Ohne den API Key funktioniert der Bot nicht!

1. Hol dir deinen Anthropic API Key:
   - Geh auf [console.anthropic.com](https://console.anthropic.com/settings/keys)
   - Klick **Create Key**
   - Kopier den Key (beginnt mit `sk-ant-api03-...`)

2. Füg den Key in Netlify hinzu:
   - In deinem Netlify Dashboard → dein Projekt
   - Geh auf **Site configuration** → **Environment variables**
   - Klick **Add a variable**
   - Key: `ANTHROPIC_API_KEY`
   - Value: dein API Key
   - Klick **Create variable**

3. Re-deploy:
   - Geh auf **Deploys**
   - Klick **Trigger deploy** → **Deploy site**

### Schritt 5 — Custom Domain (optional)

Standardmäßig bekommst du eine URL wie `random-name-123.netlify.app`.

Für eine eigene Domain (z.B. `dircbotdemo.netlify.app`):
1. **Site configuration** → **Site information**
2. Klick **Change site name**
3. Wähl `dircbotdemo` oder einen anderen verfügbaren Namen

Für eine echte Domain (z.B. `bot.n3xus.de`):
1. **Domain management** → **Add custom domain**
2. Folge den DNS-Anweisungen

---

## ✅ Fertig! So testest du:

1. Öffne deine Netlify-URL
2. Wähl eine der 3 Beispielfragen ODER tipp eine eigene
3. Schau ob du eine echte Antwort bekommst (kann 3-8 Sekunden dauern)
4. Stell 3 Fragen → CTA sollte erscheinen
5. Trag eine Test-Email ein → sollte in Netlify unter **Forms** auftauchen

---

## 🧠 Wissensdatenbank erweitern

Die Bot-Antworten basieren auf den Markdown-Files im Ordner `knowledge-base/`. Jedes File ist eine Sektion der Wissensdatenbank.

**Aktuelle Files:**
- `00_identity.md` — Wer du bist, Voice, Anti-Patterns
- `01_sales.md` — Sales Frameworks (3-Step Pattern, 3-List Method, etc.)
- `02_crypto.md` — Crypto, DCA, Cycles, Tokenization
- `03_scaling.md` — Business Building, 4 Stages, Team
- `04_wealth.md` — Asset Allocation, 4-Quadrant Framework
- `05_product.md` — Produkt, Pricing, Sales Logic
- `06_no_go.md` — Was der Bot NIE tut
- `07_languages.md` — Sprachadaptierungen (EN/DE/ES)

**So fügst du neues Wissen hinzu:**

1. Erstell ein neues `.md` File in `knowledge-base/`
   - Z.B. `07_network_marketing.md` oder `08_tokenization_cases.md`
2. Schreib dein Wissen in Markdown rein
3. Commit & push → Netlify deployed automatisch
4. Der Bot kennt das neue Wissen sofort

**Beste Struktur für KB-Files:**
- Klare Überschrift (`# Topic`)
- Sektionen mit `##`
- Frameworks als nummerierte Listen
- "Proof Points" am Ende ("I closed X deals with this...")
- Trigger-Keywords ("When asked about Y, use this framework")

---

## 🔧 Anpassungen

### Anzahl der gratis Fragen ändern

In `assets/app.js`, Zeile ~5:
```js
let messagesLeft = 3;  // ← ändere hier
```

### Vorgeschlagene Fragen ändern

In `assets/app.js`, suche `suggestedQuestions` (Zeile ~30) und passe an:
```js
const suggestedQuestions = {
  1: { en: "...", de: "..." },
  2: { en: "...", de: "..." },
  3: { en: "...", de: "..." }
};
```

Und im HTML in `index.html` die Chip-Buttons entsprechend anpassen.

### Bot-Modell ändern

In `netlify/functions/chat.js`, Zeile mit `model:`:
- `claude-sonnet-4-6` (Standard — gut & günstig)
- `claude-opus-4-7` (klügster, teurer)
- `claude-haiku-4-5-20251001` (am billigsten, schneller)

### Antwortlänge anpassen

In `netlify/functions/chat.js`:
```js
max_tokens: 1024,  // ← höher für längere Antworten
```

### Farben anpassen

In `assets/style.css` — Brand-Farben sind:
- Orange: `#e8420a`
- Gold: `#c9a84c`
- Dunkel: `#0a0a0a`, `#111`, `#1a1a1a`

---

## 📥 Leads abrufen

Email-Captures landen automatisch in **Netlify Forms**:

1. Netlify Dashboard → dein Projekt → **Forms**
2. Du siehst alle Submissions
3. Klick auf eine Submission → siehst die Email
4. Export als CSV möglich

**Email-Benachrichtigung einrichten:**
1. **Forms** → **Settings & usage** → **Form notifications**
2. Add notification → **Email notification**
3. Trag deine Email ein → bekommst jede neue Anmeldung sofort

---

## 💰 API-Kosten

Claude Sonnet 4.6 (Standardmodell):
- Input: ~$3 pro 1M Tokens
- Output: ~$15 pro 1M Tokens

**Text-Nachricht:**
- System Prompt + KB: ~6.000 Tokens
- User-Frage: ~50 Tokens
- Antwort: ~300 Tokens
- **→ ~$0.02 – $0.05 pro Frage**

**Mit Bild-Upload:**
- Zusätzlich ~1.500–2.500 Tokens für ein typisches Bild
- **→ ~$0.04 – $0.08 pro Frage mit Bild**

**Mit PDF-Upload:**
- Zusätzlich ~1.000 Tokens pro PDF-Seite
- **→ je nach PDF-Größe**

Bei 3-Nachrichten-Limit pro Visitor:
- **~$0.06 – $0.30 pro Lead** (abhängig vom Upload-Verhalten)

Netlify selbst: **gratis** bis 125k Requests/Monat.

**Tipp:** Dein bestehender Anthropic API Key mit Guthaben funktioniert genau dafür. Du musst nichts Neues kaufen — einfach den Key in Netlify Environment Variables einfügen (siehe Schritt 4 oben).

---

## 🛠 Lokal testen (optional)

Wenn du lokal entwickeln willst:

```bash
# Netlify CLI installieren
npm install -g netlify-cli

# In den Projekt-Ordner
cd dircbot-netlify

# Dependencies installieren
npm install

# Lokales `.env` File anlegen
cp .env.example .env
# Trag deinen API Key in .env ein

# Lokal starten
netlify dev
```

Öffnet `http://localhost:8888` mit der vollen Funktionalität.

---

## 🆘 Troubleshooting

**Bot antwortet nicht / Error 500**
→ API Key nicht gesetzt oder falsch. Check Netlify → Environment Variables.

**Bot antwortet komisch / falsch**
→ Wissensdatenbank checken. Vielleicht widerspricht sich ein File.

**Function Timeout**
→ Antworten sind zu lang. `max_tokens` in `chat.js` reduzieren.

**Email-Capture funktioniert nicht**
→ Netlify Forms aktivieren: **Forms** → muss "active" sein. Re-deploy nach erster Form-Submission.

**Bilingual funktioniert nicht**
→ Browser-Cache leeren. `localStorage` checken.

---

## 📞 Nächste Schritte

Sobald die Demo läuft:

1. **Custom Domain** verbinden (z.B. `bot.n3xus.de`)
2. **Analytics** einbauen (Google Analytics, Plausible, oder Fathom)
3. **Mehr KB-Inhalte** hinzufügen (Stories, Cases, spezifische Frameworks)
4. **A/B Test** verschiedene Suggested Questions
5. **Telegram-Integration** als Alternative zum Email-Capture
6. **Conversation Logging** für Analyse welche Fragen gestellt werden

---

## 🔥 Built by Dirc Zahlmann

8 Unicorns. 30 Jahre Vertrieb. 15 Jahre Crypto.
Verkauft hat sich nichts von selbst.

[**n3xus.de**](https://n3xus.de) — der volle Presale.
