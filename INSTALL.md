# DircBot v8.5 — Funnel-Guardrail + Cost-Calc + Bug-Fix

## 🎯 Was neu ist in v8.5

### 1. Bug-Fix: "Verbleibende Nachrichten 0/3" weg im Tester-Mode
- Im Tester-Mode wird der untere Counter (`Verbleibende Nachrichten: 0/3`) jetzt komplett versteckt
- Der **Counter im Top-Header** (z.B. `22/500`) wird korrekt angezeigt und bleibt sticky beim Scrollen
- Das Top-Pill hat jetzt `margin-right: 200px` damit es nicht hinter dem TESTER-MODUS-Badge verschwindet

### 2. Conversion-Funnel-Guardrail (das Wichtigste)
**Der Bot routet jetzt User je nach Intent automatisch:**

| Intent | Trigger-Beispiele | Routing |
|---|---|---|
| 🔧 **Service/Build** | "kannst du mir einen Bot bauen", "AI-Agent fürs Business", "Custom Development" | **Telegram @zahlmann** (https://t.me/zahlmann) |
| 📚 **Learning** | "wie lerne ich X", "empfiehl einen Kurs", "wo studier ich Y" | **dirczahlmann.com** + passender Track |
| 🤝 **Pitch/Partnership** | "ich hab ein Projekt für dich", "Investment-Opportunity" | Telegram mit One-Pager-Anforderung |
| 💬 **Tester-Feedback** | "du solltest hinzufügen", "Feature-Request" | Telegram mit "DircBot feedback" |
| 🌐 **Casual** | Small Talk, allgemeine Fragen | Kein CTA, normale Antwort |

**Topic → Track-Mapping** (in KB-File 11 anpassbar):
- Sales/Closing → **Sales Mastery Track**
- Crypto/Blockchain → **Crypto Operator Track**
- Wealth/Family Office → **Wealth Architect Track**
- Network Marketing → **Network Recovery Track**
- Tokenization → **Tokenization Foundations**
- Mindset/Leadership → **Leadership OS**
- Scaling/Unicorns → **Unicorn Stages Track**
- AI for Business → **AI Operator Track**
- Agentic AI → **Agentic Builder Track**
- Personal Coaching → **Inner Circle Coaching**

**Critical Rules** (im System-Prompt verankert):
- Max 1 CTA pro Antwort
- CTA nie am Anfang — immer erst Framework + Value, dann am Ende routen
- Keine wiederholten CTAs in aufeinanderfolgenden Turns
- Wenn User sagt "lass uns hier weiter reden" → respektieren, kein Push
- Stay DircBot voice — nicht salesy

### 3. Kosten-Kalkulator im Admin
Neue Section "💰 Kosten-Kalkulator" im Admin-Panel:
- **Modell-Selector**: Haiku 4.5 / Sonnet 4.6 (current) / Opus 4.6 / Custom mit Auto-Preisen
- **Eingaben**: Ø Input-Tokens, Ø Output-Tokens, Nachrichten pro Tester, Aktive Tester
- **Live-Berechnung**: Gesamt-Kosten, Pro Tester, Pro Nachricht, Input/Output-Split, Total Tokens
- **Quick-Szenarien-Buttons**: 10×50, 50×100, 100×200, 500×500 (Beta-Max)
- Link zum Anthropic Console für Echtdaten

**Standard-Werte** (gut zum Starten):
- Sonnet 4.6 (€3 in / €15 out per 1M tokens)
- 2800 input tokens / msg (System + KB + Frage)
- 600 output tokens / msg
- 100 msgs pro Tester
- 50 Tester

Output bei diesen Werten: ~€72 für 50 Tester × 100 Nachrichten = 5000 Nachrichten total

### 4. A/B Prompt-Testing (Preview)
Neue Section "🧪 A/B Prompt-Testing" im Admin:
- **Variante A** = aktueller Live-Prompt (mit Funnel-Routing)
- **Variante B-Entwurf** = freies Textfeld für deinen alternativen Prompt-Override
- Lokal speicherbar (localStorage)
- **Hinweis:** Echtes A/B-Testing mit Tracking braucht Variant B (server-side). Aktuell ist es ein Drafting-Space für deine Varianten-Ideen.

---

## 🚀 Upload-Steps

1. GitHub: dircbot-v8 Inhalt überschreiben (36 Files — eine neue KB)
2. Commit: `v8.5: Funnel guardrails, cost calc, counter fix`
3. Auto-Deploy
4. Hard-Refresh

Keine neuen Env-Vars nötig — alles drin.

---

## ✅ Test-Flow für Funnel-Guardrail

### Test 1: Service-Anfrage → Telegram
1. Tester-Mode, beliebiges Topic
2. Frag: *"Kannst du mir einen AI-Agenten für mein Recruiting-Business bauen?"*
3. Bot antwortet mit Framework + **ends with** "Ping mich auf Telegram @zahlmann (https://t.me/zahlmann)"

### Test 2: Learning → Akademie
1. Frag: *"Wie kann ich Crypto richtig von Grund auf lernen?"*
2. Bot antwortet mit Basics + **ends with** "Die Crypto Operator Track auf dirczahlmann.com geht das end-to-end"

### Test 3: Casual → KEIN CTA
1. Frag: *"Wer bist du eigentlich?"*
2. Bot antwortet normal über sich — **kein** CTA am Ende

### Test 4: Counter-Fix
1. Tester-Mode aktiv
2. Unten: KEIN "Verbleibende Nachrichten: 0/3" mehr
3. Top-Header: zeigt korrektes "X/500" Pill

### Test 5: Cost-Kalkulator
1. Admin öffnen → "💰 Kosten-Kalkulator"
2. Slider/Inputs spielen, Werte updaten live
3. Quick-Szenarien testen: "100 × 200" → ~€292

---

## 📁 Files v8.5 (36 total)

```
knowledge-base/
├── 00_identity.md
├── 01_sales.md
├── 02_crypto.md
├── 03_scaling.md
├── 04_wealth.md
├── 05_product.md
├── 06_no_go.md
├── 07_languages.md
├── 08_ventures_language.md
├── 09_ai.md
├── 10_agentic_ai.md
└── 11_funnel_routing.md   ← NEU v8.5
```

---

## 🎨 KB-File 11 anpassen (Track-Namen)

Die Track-Namen im Funnel sind **Platzhalter**. Wenn du echte Kurs-Namen hast bei dirczahlmann.com, einfach `knowledge-base/11_funnel_routing.md` und `netlify/functions/chat.js` (im Funnel-Block) updaten:

```
| Sales/Closing | **Dein-echter-Sales-Kurs-Name** |
```

Wenn du mir die echten Kurs-Namen + URLs schickst, ersetz ich's direkt im nächsten Update.

---

## 🐛 Troubleshooting

**Funnel-CTA kommt zu früh / zu oft**
→ Tester-Feedback sammeln. KB-File 11 hat "max 1 CTA pro Antwort, nie am Anfang" — wenn der Bot trotzdem übertreibt, screenshoten und ich verschärfe die Rules.

**Bot routet nicht zu Telegram bei klarer Service-Anfrage**
→ Manchmal interpretiert er es als generelle Frage. Schau ob die Frage konkret genug ist. "Kannst du mir bauen" = klar. "Was ist ein Bot" = unklar (Lernfrage).

**Kosten-Kalkulator zeigt €0.00**
→ Wahrscheinlich admin.js nicht geladen. Browser-Cache leeren oder URL-Parameter `?v=9` an admin.js erzwingen.

---

Bei Bugs: Screenshot. 🔥
