# DircBot v8.15 — KB-Manager im Admin: Upload, Verwaltung, Live-Budget

## 🎯 Was neu ist in v8.15

### Vollständiges Knowledge-Base-Management im Admin
Du kannst jetzt **direkt im Admin-Browser** Files hochladen, verwalten, deaktivieren, löschen — kein GitHub-Commit mehr nötig.

**Wie es funktioniert:**
- Files werden in **Netlify Blobs** gespeichert (persistent über Deploys, kein Git nötig)
- Drag-Drop oder Datei-Picker
- Beim Upload wird automatisch:
  - Token-Anzahl berechnet
  - Bei PDFs: Text extrahiert, Seitenzahl ermittelt
  - Budget-Check (verhindert Überschreitung)
  - Limit-Check (max 20 Files, 10MB pro File)
- Bot lädt Files automatisch bei der nächsten Anfrage (30s Cache-Refresh)

### Features im KB-Manager

**Live Budget-Bar** (oben):
- Aktuelle Token-Belegung / 80.000 Max
- Farbiger Fortschritt: grün < 50%, gelb 50-80%, rot > 80%
- Smart-Hint mit aktuellem API-Cost-Estimate

**Drag-Drop Upload-Zone**:
- Multi-File-Upload auf einmal
- Pro File einzelner Progress-Indikator (✅ erfolgreich / ❌ Fehler mit Grund)
- Validierung: .pdf, .md, .txt; max 10MB
- Auto-Hide bei Erfolg nach 5s

**Active Files Liste**:
- Pro File: Icon, Titel, Token-Anzahl, Seitenzahl, Größe, Upload-Zeit
- **Preview-Button** (Auge): Modal mit den ersten 2000 Zeichen des extrahierten Texts
- **Toggle-Button** (Check): Deaktiviert das File temporär ohne zu löschen
- **Delete-Button** (Trash): Löscht permanent, mit Confirm-Dialog

**Inactive Files Section** (collapsed):
- Erscheint nur wenn Files deaktiviert sind
- Hier kannst du sie wieder aktivieren (Budget-Check beachten!)

**Repo Files Section** (collapsed, read-only):
- Zeigt die ursprünglichen MD-Files aus `knowledge-base/` im GitHub-Repo
- Diese bleiben aktiv bis du sie aus dem Repo entfernst

### Was im Bot-System geändert wurde

`chat.js`:
- Lädt jetzt KB aus **3 Quellen**: Repo-MDs + Repo-PDFs (legacy) + Netlify Blobs
- 30s Cache-Refresh → admin-uploaded Files erscheinen schnell
- Active/Inactive-Filtering: nur als "active" markierte Files gelangen in den Prompt

### Workflow

1. Du droppst PDF in Upload-Zone
2. Browser konvertiert zu base64, sendet an `/.netlify/functions/kb-manage?action=upload`
3. Function: PDF parsen → Text extrahieren → Token zählen → Budget-Check → in Blob speichern
4. Response: ✅ + Token-Count
5. Liste refresht, neue Datei in "Active Files"
6. Innerhalb 30s wird die nächste Chat-Anfrage diese Datei kennen

---

## 🛠️ Architektur

**Netlify Blobs Store**: `dircbot-kb`
- **Index-Key**: `__index` (Array aller Files mit Metadata)
- **Content-Keys**: `kb-{timestamp}-{rand}` (jeweils extrahierter Text)
- Strong consistency (sofort sichtbar nach Upload)

**Limits (im Code änderbar)**:
- `KB_MAX_FILES = 20` (aktive Files)
- `KB_MAX_FILE_SIZE_MB = 10` (pro File)
- `KB_TOKEN_BUDGET = 80000` (total)

### Backend-Endpoints (alle via `/.netlify/functions/kb-manage`):
- `GET ?action=list` — alle Files + Budget
- `POST ?action=upload` — base64-encoded File + Name + Type
- `DELETE ?action=delete&id=...` — File löschen
- `POST ?action=toggle&id=...` — Active/Inactive umschalten
- `GET ?action=preview&id=...` — Erste 2000 Zeichen anzeigen

Alle Endpoints brauchen `x-admin-pass` Header.

---

## 🚀 Upload + Test

1. GitHub: 42 Files uploaden (1 neu: `kb-manage.js`)
2. Auto-Deploy + Hard-Refresh
3. Admin öffnen → "📚 Wissensbasis-Manager"
4. PDF in Drop-Zone ziehen
5. Sehen wie es verarbeitet wird: ✅ X Tokens
6. Chat öffnen → den Bot zu dem Inhalt fragen → er antwortet aus deinem File ✓

### Test-Plan
```
1. Upload Test-PDF (z.B. 5 Seiten Sales-Framework)
2. Verifizieren: erscheint in "Active Files" mit korrekter Token-Zahl
3. Preview-Button: erste 2000 Zeichen sichtbar
4. Im Chat fragen: "Was sagt mein Sales-Framework zu Closing-Techniken?"
5. Bot antwortet aus deinem Content
6. Toggle Off → 30s warten → erneut fragen → Bot weiß es nicht mehr
7. Toggle On → 30s warten → wieder verfügbar
8. Delete → File und Content komplett weg
```

---

## ⚠️ Wichtig zu wissen

### Netlify Blobs ist Beta aber stable
Seit 2023 in Beta, weit verbreitet, keine Kosten auf normalen Plans. Sollte langfristig laufen.

### Falls Blobs nicht funktionieren
- Logs in Netlify Dashboard checken
- Manchmal braucht es 1 Deploy bis Blobs aktiviert sind
- Fallback: Repo-Files in `knowledge-base/` funktionieren weiter

### Sicherheit
- Inhalte landen im **System-Prompt jeder Chat-Anfrage**
- Lade **keine vertraulichen Mandantendokumente** hoch
- Empfohlen: nur deine eigenen Frameworks, Decks, Trainings

### Wenn das Budget knapp wird
Master-Files erstellen (zusammengefasst aus mehreren PDFs) reduziert dramatisch die Tokens. Frag Claude — hier in unserem Chat können wir das gemeinsam machen aus deinen hochgeladenen PDFs.

---

## 📁 Files v8.15 (42 total, +1 neu)

Neu:
- `netlify/functions/kb-manage.js` 🆕 — Upload/List/Delete/Toggle/Preview API

Modified:
- `package.json` — `@netlify/blobs` dependency hinzu
- `netlify/functions/chat.js` — KB lädt jetzt auch aus Netlify Blobs (3 Quellen kombiniert), 30s Cache-Refresh
- `netlify/functions/kb-stats.js` — Zeigt jetzt auch Blob-Files
- `admin.html` — Voller KB-Manager mit Upload-Zone, Active-Liste, Inactive-Collapsible, Preview-Modal
- `assets/admin.js` — Upload/Delete/Toggle/Preview-Logic, renderKbStatsV15
- `assets/admin.css` — Upload-Zone + Managed-List + Preview-Modal CSS
