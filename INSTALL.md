# DircBot v8.18 — Blob Consistency Fix

## 🐛 Problem v8.17

Nach `connectLambda` warf Netlify Blobs einen Folge-Fehler:
```
Netlify Blobs has failed to perform a read using strong consistency
because the environment has not been configured with a 'uncachedEdgeURL' property
```

**Root cause:** `consistency: 'strong'` braucht zusätzliche Konfiguration die Netlify im Lambda-Mode nicht automatisch setzt.

## ✅ Fix in v8.18

`consistency: 'strong'` aus allen `getStore`-Aufrufen entfernt → default ist **eventual consistency**, was für unseren Use-Case völlig ausreicht weil:
- Chat-KB-Loader cached eh 30s lang
- Admin-UI refresht List nach Upload manuell
- Eventual-Consistency propagiert global in <60 Sekunden (meist <5 Sekunden)

## 🚀 Test

1. ZIP nach GitHub
2. **Trigger Deploy** (Clear cache + deploy) in Netlify
3. Hard-Refresh im Admin
4. PDF droppen → sollte jetzt ✅

## 📁 Files v8.18 (42 total)

Modified:
- `netlify/functions/chat.js` — strong consistency entfernt
- `netlify/functions/kb-stats.js` — strong consistency entfernt
- `netlify/functions/kb-manage.js` — strong consistency entfernt
