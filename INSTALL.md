# DircBot v8.16 — Bugfix: KB-Manager prompted Admin-Pass jetzt selbst

## 🐛 Was gefixt wurde

In v8.15 musstest du **erst auf "Bewerbungen laden" klicken** damit der Admin-Pass gesetzt wurde — sonst zeigte der KB-Upload "Admin-Pass fehlt. Erst Submissions laden."

Außerdem inkonsistent: Submissions speicherten den Pass in `sessionStorage`, KB las aus `localStorage` → klappte auch dann nicht zuverlässig.

## ✅ Was jetzt funktioniert

- **Zentrale `getAdminApiPass()` Helper-Funktion**: Promptet bei Bedarf, speichert in sessionStorage (vereinheitlicht mit Submissions)
- **Auto-Prompt beim ersten Bedarf**: Sobald du eine Datei droppst oder die Seite öffnest, kommt der Pass-Dialog (falls noch nicht eingegeben)
- **401-Handling**: Wenn falsches Passwort → Auto-Clear + verständliche Fehlermeldung mit "Nochmal versuchen"-Link
- **Konsistenz**: Submissions, KB-Stats, KB-Upload, KB-Delete, KB-Toggle, KB-Preview — alle nutzen jetzt denselben Helper

## 🚀 Upload + Test

1. ZIP nach GitHub hoch
2. Hard-Refresh im Admin
3. Admin öffnen → KB-Manager sollte **direkt** den API-Pass-Prompt zeigen
4. Eingeben → Stats laden + Dateien können hochgeladen werden

## 📁 Files v8.16 (42 total — keine neuen)

Modified:
- `assets/admin.js` — `getAdminApiPass()` + `clearAdminApiPass()` Helper, alle KB-Functions auf sessionStorage umgestellt, 401-Handling in loadKbStats/upload/delete/toggle/preview
