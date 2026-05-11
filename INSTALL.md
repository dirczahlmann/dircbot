# 🔥 DircBot — Logo + Portrait Update (v4)

## ✅ Was neu ist

- ✅ **Logo als SVG** — gestochen scharf, keine JPG-Kanten mehr, skaliert perfekt
- ✅ **Portrait im Hero** — dein professionelles Foto rechts vom Headline-Text
- ✅ **"8 Unicorns" Badge** — orange-gold, schräg auf dem Portrait als Eye-Catcher
- ✅ **Mobile-optimiert** — auf dem Handy stackt das Portrait über den Text

## 📦 Files in diesem ZIP (5 zum Überschreiben + 1 neu)

```
assets/
├── dirc_logo.svg          ← NEU (ersetzt JPG)
├── dirc_portrait.jpg      ← NEU (dein Foto, web-optimiert auf 184 KB)
├── style.css              ← ÜBERSCHREIBT
└── legal.css              ← ÜBERSCHREIBT

index.html                  ← ÜBERSCHREIBT
impressum.html              ← ÜBERSCHREIBT
datenschutz.html            ← ÜBERSCHREIBT
nutzungsbedingungen.html    ← ÜBERSCHREIBT
```

## 🚀 Upload (1 Min)

1. ZIP entpacken
2. Auf **github.com/dirczahlmann/dircbot** → **Add file** → **Upload files**
3. Drag den **gesamten Ordner-Inhalt mit Unterordnern** rein
4. GitHub fragt bei Duplikaten: **Replace existing file** → Ja
5. Commit: `Update logo to SVG, add hero portrait`
6. ~1 Min warten → **Cmd+Shift+R**

## 🎯 Was du sehen solltest

**Desktop:**
- Logo oben links — gestochen scharf, keine Kanten
- Hero ist jetzt zweispaltig: Text links, dein Portrait rechts
- "8 Unicorns" Badge orange-gold auf dem Portrait

**Mobile:**
- Portrait stackt über den Text
- Logo etwas kleiner
- Badge entsprechend kleiner

## 🛡️ Falls was nicht passt

**Logo wird nicht angezeigt:**
- Check ob `dirc_logo.svg` wirklich in `assets/` Ordner liegt
- Hard refresh: `Cmd+Shift+R`

**Portrait wird nicht geladen:**
- Check ob `dirc_portrait.jpg` in `assets/` liegt
- Filename muss exakt `dirc_portrait.jpg` heißen (lowercase, kein Leerzeichen)

**Alte Logo-JPG noch da:**
- Du kannst die `assets/dirc_logo.jpg` jetzt löschen (oder einfach drinlassen, schadet nicht)

## 💡 Bonus: Portrait austauschen

Wenn du ein anderes Foto willst:
1. Foto bearbeiten — quadratisch oder 4:5 Hochformat
2. Auf ~800px Breite skalieren
3. Als JPG mit Qualität 85-90 speichern
4. Auf GitHub `assets/dirc_portrait.jpg` durch das neue ersetzen

---

Nach Deploy → Topic-Sidebar! 🔥
