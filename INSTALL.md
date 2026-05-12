# DircBot v8.14 — Prompt Caching ⚡

## 🎯 Was neu ist in v8.14

### Anthropic Prompt-Caching aktiviert
Der System-Prompt ist jetzt zweigeteilt:
- **Statischer Block** (cached, 5min TTL): Identity + Voice + Rules + KB + Memory-Protocol — ~5500 Tokens
- **Dynamischer Block** (fresh): Language + Topic + Profile + Memories + Project — ~500 Tokens

Anthropic cached den statischen Block automatisch und bei jedem **Cache-Hit kostet er nur 10% des normalen Input-Preises**. Bei jedem **Cache-Miss** (erste Anfrage, oder nach 5 Min Inaktivität) wird der Cache neu aufgebaut für 1.25× Input-Preis — Einmalkosten, dann läuft 5 Minuten kostengünstig.

### Konkrete Cost-Math

**Pro Nachricht (Sonnet 4.6):**
| Komponente | Ohne Cache | Mit Cache (Hit) |
|---|---|---|
| Static System+KB (5.5k tok) | €0.0165 | €0.0017 |
| Dynamic Context (0.5k tok) | €0.0015 | €0.0015 |
| Conversation History (2.3k tok) | €0.0069 | €0.0069 |
| Output (600 tok) | €0.0090 | €0.0090 |
| **TOTAL** | **€0.034** | **€0.019** |

**Pro Subscription (€50/Monat, avg 200 msgs):**
- **Vorher**: €7 API → €28.70 Profit (57%)
- **Jetzt**: €4 API → **€31.70 Profit (63%)**
- **Bei 1000 Subscribers**: €3.000 mehr Profit pro Monat = €36.000/Jahr

### Admin: "⚡ Prompt-Cache Performance"
Neue Section zeigt live:
- **Cache Hit-Rate** (Ziel: 70%+ bedeutet User chatten in Folge)
- **Geschätzte Ersparnis** in $ vs. ohne Caching
- **Ø Cost pro Nachricht** aktuell
- **Tracked Messages** (rolling buffer letzte 100 deines Browsers)

Smart-Hint unten:
- ✅ 70%+ Hit-Rate: "Caching läuft optimal"
- 🟡 40-70%: "OK, nicht maximal"
- 🔴 <40% (bei genug Daten): "User-Pausen zu lang"

### Pricing-Section im Admin aktualisiert
Reflektiert jetzt die niedrigeren API-Kosten mit Caching. Profit-Marge sprang von 57% auf 63% (avg) und von 36% auf 51% (worst case).

---

## ⚠️ Wichtig: Wann Caching NICHT greift

- **Erste Nachricht** (Cache-Write, 1.25× Input-Preis einmalig)
- **Nach 5 Min Inaktivität** (Cache läuft ab, nächste Msg = Cache-Write)
- **KB-Update** (neue PDFs/MDs → komplett neuer Cache)
- **Bot-Deploy** (neue Netlify-Function-Instanz → Cache cold)

Mit typischem User-Verhalten (Chat-Burst: 3-10 Nachrichten in 1-2 Min) erreichst du 70-85% Hit-Rate.

---

## 🚀 Upload + Test

1. GitHub upload (41 Files)
2. Auto-Deploy + Hard-Refresh
3. Chat 5-10 Nachrichten in Folge als Tester
4. Admin → "⚡ Prompt-Cache Performance" → siehst Hit-Rate aufbauen

### Verifizieren dass Caching wirklich läuft
Browser Console (F12) während Chat:
```
[cache] read=5847 create=0 input=412 output=523
```
- `read > 0`: ✅ Cache greift (90% billiger für diesen Anteil)
- `create > 0` (only first msg): Cache wird aufgebaut
- Wenn beide 0: irgendwas stimmt nicht (KB unter 1024 Tokens? unwahrscheinlich)

---

## 📁 Files v8.14 (41 total, keine neuen)

Modified:
- `netlify/functions/chat.js` — System-Prompt als Array mit `cache_control: ephemeral` auf statischem Block
- `assets/app.js` — `trackCacheStats()` schreibt rolling buffer in localStorage
- `assets/admin.js` — `loadCacheStats()` + `renderCacheStats()` mit Hit-Rate-Display
- `assets/admin.css` — Cache-Stats-Grid CSS
- `admin.html` — "⚡ Prompt-Cache Performance" Section + updated Pricing-Breakdown
