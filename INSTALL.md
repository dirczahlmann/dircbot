# DircBot v8.1 — Tester Signup Page + Admin Panel

**Was in diesem Update neu ist (v8.1 vs v8):**

- 🛠️ **Action-Buttons-Fix** — Kopieren/Teilen/Andere Antwort sind jetzt kleine Boxen UNTER der Antwort, nicht mehr senkrechte Balken rechts
- 📝 **`/tester-signup.html`** — Vollwertige Landing Page für Tester-Bewerbungen (Equinat-Style)
- 🛡️ **`/admin.html`** — Passwortgeschütztes Admin-Panel mit Email-Generator
- 🔗 **Verlinkungen** — Tester-Wall und CTA-Sektion linken jetzt zur Signup-Page

---

## 🌐 Drei URLs nach dem Deploy

| URL | Wer? | Was? |
|-----|------|------|
| `dircbot.netlify.app/` | Alle | Bot mit 3 Free-Messages + Tester-Code-Eingabe |
| `dircbot.netlify.app/tester-signup.html` | Interessenten | Bewerbung als Beta-Tester (Form → Netlify Forms) |
| `dircbot.netlify.app/admin.html` | Nur Dirc | Code-Verwaltung + Email-Generator |

---

## 🔐 Admin-Passwort

**Default:** `dirczahlmann2026`

⚠️ **Wichtig:** Das Passwort ist im JS-Source-Code sichtbar (Frontend-only). Das ist **keine echte Security**, nur Obscurity. Wer den Source liest, findet das Passwort. Für echte Security: später Netlify Identity.

**Passwort ändern:** Öffne `assets/admin.js`, Zeile 7:
```js
const ADMIN_PASSWORD = 'dirczahlmann2026';
```
Ändere den String. Deploy. Fertig.

**Wo wird das Passwort gespeichert?** SessionStorage im Browser — gilt nur für die aktuelle Browser-Session. Logout oder Tab schließen → wieder Passwort nötig.

---

## 📝 Admin-Panel Features

Auf `dircbot.netlify.app/admin.html`:

1. **📊 Übersicht** — Stats über Codes, Quotas, Themen
2. **📧 Tester-Bewerbungen** — Direkt-Link zu Netlify Forms Dashboard
3. **🔑 Tester-Codes-Liste** — Alle 10 Codes als Cards mit Copy-Button
4. **✉️ Email-Generator** — Tester-Name + Code wählen → fertige Welcome-Email in DE/EN/ES generieren und kopieren
5. **⚡ Quick Actions** — Links zu Netlify, GitHub, Anthropic Console, Academy
6. **🚀 Variant B Preview** — Was später kommt (serverseitige Quota, etc.)

**Email-Generator-Flow:**
1. Vorname eintippen: z.B. "Anna"
2. Code wählen: z.B. "DIRC500"
3. Sprache wählen: DE/EN/ES
4. "📝 Email generieren" klicken
5. "📋 Kopieren" klicken
6. In Email-Client einfügen → an Tester senden

Die generierte Email enthält: Code, URL, Anleitung, Feature-Liste, Feedback-Bitte, Signatur.

---

## 📝 Tester-Signup Landing Page Flow

Auf `dircbot.netlify.app/tester-signup.html`:

1. Hero: "Bau die Zukunft mit mir" mit Stats (50 Plätze · 500 Nachrichten · 0€ · 8 Themen)
2. 4-Schritte-Prozess (Bewerbung → Freischaltung → Testen → Nach der Beta)
3. Feature-Grid (6 Topic-Cards)
4. Affiliate-Teaser
5. Bewerbungs-Formular mit Feldern:
   - Vorname, Nachname (Pflicht)
   - Email (Pflicht)
   - Telegram-Handle (Pflicht)
   - Instagram-Handle (optional)
   - Hauptinteresse (Dropdown der 8 Topics, Pflicht)
   - Land/Region (optional)
   - Größte Herausforderung (Pflicht)
   - Motivation (optional)
   - Consent-Checkboxes (Datenschutz, AI-Disclaimer, Affiliate, Marketing)
6. Submit → Netlify Forms → Email an dich
7. Success-State: "Bewerbung eingegangen! Antwort in 48h."

**Dein Workflow:**
1. Du bekommst Email von Netlify mit Bewerbungs-Daten
2. Du screenst und entscheidest
3. Du gehst zum Admin-Panel → Email-Generator
4. Generierst die Welcome-Email mit Code
5. Schickst sie an den Tester

---

## 🚀 Upload-Schritte (gleich wie vorher)

**Option 1: GitHub (empfohlen)**
1. https://github.com/dirczahlmann/dircbot
2. "Add file" → "Upload files"
3. Inhalt von `dircbot-v8/` reinziehen (alle 28 Files inkl. neue `tester-signup.html`, `admin.html`, `assets/admin.js`, `assets/admin.css`, `assets/tester-signup.css`)
4. Commit: `v8.1: Tester signup page + admin panel + action button fix`
5. Netlify deployed automatisch

**Option 2: Direct-Drop zu Netlify**
1. https://app.netlify.com/sites/dircbot/deploys
2. Drag den `dircbot-v8/`-Ordner rein
3. Fertig in 30 Sek

**Nach dem Deploy:**
- **Hard-Refresh** im Browser: `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Win)
- Test: Geh auf `dircbot.netlify.app/admin.html` → Passwort eingeben → Panel öffnet sich
- Test: Geh auf `dircbot.netlify.app/tester-signup.html` → Form sollte sauber aussehen

---

## 🔑 Tester-Codes (unverändert)

```
DIRC500            Universal Master
DIRCBETA           Beta Wave
DIRCINSIDER        Inner Circle
LAUNCH2026         Launch Campaign
UNICORN8           8 Unicorns Reference
SALESGENT          Sales Gentleman
CRYPTO2011         Year Started in Crypto
TOKEN500           Tokenization Theme
DZACADEMY          Academy Members
PRESALE500         Presale Connection
```

Bearbeiten in `assets/topics.js`, Suche nach `VALID_TESTER_CODES`.

---

## 📁 File-Übersicht v8.1

```
dircbot-v8/
├── INSTALL.md
├── index.html                      ← Updated: Link zur Signup-Page
├── tester-signup.html              ← NEU: Bewerbungs-Page
├── admin.html                      ← NEU: Admin-Panel
├── impressum.html
├── datenschutz.html
├── nutzungsbedingungen.html
├── netlify.toml
├── package.json
├── .env.example
├── .gitignore
│
├── assets/
│   ├── topics.js                   ← Codes-Liste
│   ├── app.js                      ← Bot Logic
│   ├── style.css                   ← Updated: Action-Button-Fix
│   ├── consent.js
│   ├── legal.css
│   ├── tester-signup.css           ← NEU
│   ├── admin.js                    ← NEU: mit Email-Templates
│   ├── admin.css                   ← NEU
│   ├── dirc_logo.svg
│   └── dirc_portrait_sharp.jpg
│
├── knowledge-base/                 (8 Files, unchanged)
│
└── netlify/functions/chat.js       (unchanged)
```

---

## 🐛 Troubleshooting

**Action-Buttons immer noch senkrecht?**
→ Hard-Refresh: `Cmd+Shift+R`. Das v8.1 CSS hat `!important` overrides die das Layout erzwingen.

**Admin-Panel akzeptiert Passwort nicht?**
→ Default: `dirczahlmann2026` (kleinbuchstaben, kein Space, mit der Jahreszahl 2026)

**Tester-Signup Form geht nicht durch?**
→ Netlify muss das `form-name=dircbot-tester-signup` Form erkannt haben. Bei erstem Deploy kann das ein paar Minuten dauern. Check: https://app.netlify.com/sites/dircbot/forms

**Bewerbungen kommen nicht per Email?**
→ Netlify Forms → Settings → Form notifications. Email-Adresse hinzufügen.

---

**Bei Problemen:** Screenshot in den Chat — ich seh sofort was los ist. 🔧
