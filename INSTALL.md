# DircBot v8 — Big Tester Update

**Was neu ist** vs. dem aktuell live laufenden DircBot:

- 🔐 **Tester-System** — 3 Nachrichten frei für alle, dann Code-Wall → 500 Nachrichten für Tester
- 📑 **Topic-Sidebar** (Tester-Mode) — 8 Themen mit je 4 vorgeschlagenen Fragen in einem 2×2 Grid
- 📊 **Message-Counter + Progress-Bar** — wie bei Equinat, mit Farbwechsel grün → amber → rot
- 🎤 **Voice Input** — Mikrofon-Button, nutzt Web Speech API (DE/EN/ES)
- 📋 **Copy + Share Buttons** unter jeder Bot-Antwort
- 🔄 **Try-Another-Answer Button** — Bot generiert die Antwort neu mit anderem Winkel
- 🆕 **New Chat Button** — Tester können einen frischen Chat starten
- 🤖 **Topic-aware Backend** — Wenn Tester ein Thema gewählt hat, fokussiert der Bot die relevanten KB-Sections

---

## 🚀 Upload auf GitHub (überschreibt das alte Repo)

Du hast bereits das Repo `github.com/dirczahlmann/dircbot`. Wir überschreiben jetzt einfach.

### Option 1: GitHub Web UI (einfach)

1. Geh auf https://github.com/dirczahlmann/dircbot
2. **Lösche zuerst die alten Dateien** die nicht mehr existieren (gibt es eigentlich nur eine: `topics.js` ist neu, sonst Updates)
3. Klick **"Add file" → "Upload files"**
4. Zieh **den GESAMTEN Inhalt** des `dircbot-v8/`-Ordners rein (nicht den Ordner selbst!)
   - Wichtig: auch die Hidden Files mitkopieren — `.env.example` und `.gitignore` (auf Mac: `Cmd+Shift+.` um sie sichtbar zu machen)
5. Commit message: `v8: Tester system + topic sidebar + voice/copy/share`
6. **Commit changes**
7. Netlify deployed automatisch in ~2 Min

### Option 2: Drag & Drop direkt zu Netlify (noch einfacher)

1. Geh auf https://app.netlify.com → dein DircBot Site
2. **Deploys** → unter "Drag and drop your site folder here"
3. Zieh den **gesamten `dircbot-v8/` Ordner** rein
4. Fertig — live in ~30 Sek
5. **Wichtig:** Wenn du diese Methode nutzt, geht der GitHub-Sync verloren. Mach dann später nochmal Option 1.

---

## 🔑 Tester-Codes

Die folgenden 10 Codes funktionieren ab Deployment. Jeder Tester gibt einen ein → unlock 500 Nachrichten in seinem Browser.

```
DIRC500
DIRCBETA
DIRCINSIDER
LAUNCH2026
UNICORN8
SALESGENT
CRYPTO2011
TOKEN500
DZACADEMY
PRESALE500
```

**Wie du sie verteilst:**
- Telegram-Gruppen: jeder Channel bekommt einen eigenen Code → du kannst Tracken woher die Tester kamen
- Instagram-Stories: "Comment 'TESTER' → DM mit Code"
- LinkedIn: Direkt-DM an Top-Connections
- Email an deine Liste

**Codes ändern / hinzufügen:** Editier die Liste in `assets/topics.js`, Zeile mit `VALID_TESTER_CODES`. Neu deployen.

⚠️ **Wichtiger Hinweis zu Variante A:** Diese Implementierung ist *Browser-basiert*. Ein Tester der in Inkognito-Mode wechselt oder den Browser-Speicher löscht, bekommt 500 neue Nachrichten. Für die erste Test-Phase ist das OK — wenn Missbrauch passiert, machen wir Variante B (serverseitig mit Netlify Blobs).

---

## ✅ Testen nach dem Deployment

1. Öffne `dircbot.netlify.app`
2. **Free-Test:** 3 Nachrichten schreiben → Wall sollte erscheinen → Klick "Have a tester code"
3. **Tester-Code:** `DIRC500` eingeben → Topic-Sidebar links erscheint
4. **Topic-Test:** Auf "Sales & Closing" klicken → 2×2 Grid mit 4 Fragen → eine anklicken
5. **Counter:** Oben rechts sollte stehen "1 / 500", grüne Progress-Bar
6. **Voice:** Mikrofon-Button drücken → Browser fragt Erlaubnis → sprechen → Text erscheint im Input
7. **Copy/Share/Try Another:** Über eine Bot-Antwort hovern → 3 Buttons erscheinen unten

### Debug-Befehle (Browser Console)

```javascript
// State checken
dircbotDebug.state()

// Alles resetten (zurück zu 0 Nachrichten, kein Code)
dircbotDebug.reset()
```

---

## 📁 Datei-Übersicht

```
dircbot-v8/
├── INSTALL.md (diese Datei)
├── index.html                      ← Updated: Sidebar, Wall, Counter, Mic
├── impressum.html                  ← unchanged
├── datenschutz.html                ← unchanged
├── nutzungsbedingungen.html        ← unchanged
├── netlify.toml                    ← unchanged
├── package.json                    ← unchanged
├── .env.example                    ← unchanged (Hidden File)
├── .gitignore                      ← unchanged (Hidden File)
│
├── assets/
│   ├── topics.js                   ← NEU: 8 Topics + Tester-Codes
│   ├── app.js                      ← Rewritten: alle neuen Features
│   ├── style.css                   ← Extended: +600 Lines neue UI
│   ├── consent.js                  ← unchanged
│   ├── legal.css                   ← unchanged
│   ├── dirc_logo.svg               ← unchanged
│   └── dirc_portrait_sharp.jpg     ← unchanged
│
├── knowledge-base/                 ← unchanged (8 Files)
│   ├── 00_identity.md
│   ├── 01_sales.md
│   ├── 02_crypto.md
│   ├── 03_scaling.md
│   ├── 04_wealth.md
│   ├── 05_product.md
│   ├── 06_no_go.md
│   └── 07_languages.md
│
└── netlify/functions/
    └── chat.js                     ← Updated: Topic-Context, neuer Payload
```

---

## ⚙️ Backend-Änderungen im Detail

**`chat.js`** wurde umgebaut für den neuen Frontend-Payload:

**Vorher** (v7):
```json
{ "messages": [...], "language": "de" }
```

**Jetzt** (v8):
```json
{
  "message": "User-Frage",
  "conversationHistory": [...],
  "language": "de",
  "topic": "crypto",
  "fileData": "base64...",
  "fileType": "image/png",
  "fileName": "foto.png"
}
```

Wenn `topic` mitgeschickt wird, injiziert das Backend einen Focus-Block in den System-Prompt, der dem Bot sagt: "Konzentrier dich auf die KB-Sections für dieses Thema". Das macht Antworten deutlich relevanter.

Die API-Key-Config ändert sich NICHT — `ANTHROPIC_API_KEY` ist weiterhin in Netlify Environment Variables.

---

## 🐛 Bekannte Limits & nächste Schritte

**Variante B (geplant für später):**
- Server-seitige Quota pro Code (echte 500-Nachrichten-Limits, nicht umgehbar)
- Tracking welcher Code wie oft genutzt wurde
- Einmalige Codes pro Tester (DIRC-A7F2-9KX statt Universal-Codes)
- Erfordert Netlify Blobs oder Supabase

**Wann auf Variante B upgraden?**
- Wenn du merkst dass Tester Codes weitergeben und Inkognito missbrauchen
- Wenn du genau tracken willst welche Tester wie aktiv sind
- Wenn du die Codes monetarisieren willst (z.B. "1€ für 500 Test-Nachrichten")

**Nach dem Deployment:**
- Migrating to `bot.dirczahlmann.com` (DNS CNAME zu `dircbot.netlify.app`)
- Custom Domain in Netlify Settings hinzufügen
- SSL automatisch via Let's Encrypt

---

## 🆘 Wenn was nicht funktioniert

1. **Tester-Code wird nicht akzeptiert** → Browser Console öffnen, Fehler checken. Codes sind case-insensitive, aber müssen exakt einer aus der Liste sein.
2. **Voice geht nicht** → Browser-Erlaubnis prüfen (chrome://settings/content/microphone). Funktioniert nicht in Firefox-iOS.
3. **Topic-Sidebar erscheint nicht** → Du bist noch nicht im Tester-Mode. Code muss eingegeben sein, dann reload.
4. **Counter zeigt falsche Zahl** → `dircbotDebug.reset()` in Console.
5. **Bot antwortet nicht** → Netlify Function Logs checken (Netlify UI → Functions → chat → Logs). Häufig: `ANTHROPIC_API_KEY` nicht gesetzt oder falsch.

---

**Bei Fragen:** Schick einen Screenshot in den Chat, ich helf direkt.
