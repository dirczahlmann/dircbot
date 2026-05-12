# DircBot v8.17 — Netlify Blobs Lambda-Compat Fix

## 🐛 Was kaputt war

`MissingBlobsEnvironmentError: The environment has not been configured to use Netlify Blobs`

**Root cause:** Unsere Functions nutzen den **Lambda-Compatibility-Mode** (`exports.handler = async (event) => {...}`). In diesem Mode injiziert Netlify den Blobs-Context **NICHT automatisch** — wie es bei ESM-Functions (`export default`) der Fall wäre.

Bekanntes Netlify-Behavior: https://github.com/netlify/blobs/issues/175

## ✅ Was jetzt funktioniert

Drei-fache Fallback-Strategie in allen drei Blob-Funktionen (chat.js, kb-stats.js, kb-manage.js):

**Strategy 1: `connectLambda(event)`**
Offizielle Netlify-Methode für Lambda-Mode. Wird beim Handler-Start mit dem event aufgerufen und initialisiert den Blobs-Context.

**Strategy 2: Manuelle Config über Env-Vars**
Falls Strategy 1 fehlschlägt, nutzen wir explizite `siteID + token` aus Env-Vars:
- `NETLIFY_SITE_ID` (oder `SITE_ID`)
- `NETLIFY_BLOBS_TOKEN` (oder `NETLIFY_AUTH_TOKEN`)

**Strategy 3: Default Auto-Discovery**
Fallback auf default `getStore()` falls Context-Injection nach Deploy doch funktioniert.

## 🚀 Upload + Test

1. ZIP nach GitHub (42 Files, keine neuen)
2. **Wichtig**: in Netlify Dashboard sicherstellen dass die Function neu deployed wird:
   - **Deploys → Trigger deploy → Clear cache and deploy site**
3. Hard-Refresh im Admin
4. KB-Manager öffnen → PDF in Drop-Zone

### Falls Strategy 1 (connectLambda) klappt → fertig.

### Falls weiter Fehler (Strategy 2 brauchen):

In Netlify Dashboard → **Site configuration → Environment variables → Add a variable**:

1. **NETLIFY_SITE_ID**
   - Wert: Dein Site-ID, zu finden unter **Site configuration → General → Project information → Project ID**

2. **NETLIFY_BLOBS_TOKEN** (Personal Access Token)
   - Generieren unter: https://app.netlify.com/user/applications#personal-access-tokens
   - Klick **"New access token"** → Description: `DircBot Blobs Access` → Generate
   - Den Token kopieren (wird nur EINMAL gezeigt!) und als Env-Var setzen

3. **Trigger Deploy → Clear cache and deploy**

Nach Deploy sollte Upload funktionieren.

## 📁 Files v8.17 (42 total)

Modified:
- `netlify/functions/chat.js` — `ensureBlobsContext(event)` + `getBlobStore()` helpers
- `netlify/functions/kb-stats.js` — `initBlobs(event)` helper
- `netlify/functions/kb-manage.js` — `initBlobs(event)` helper

