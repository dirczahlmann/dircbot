# 🔥 DircBot — Hero Fix (v5)

## ✅ Was gefixt wurde

**Problem 1: Logo abgeschnitten** ✓
- SVG viewBox vergrößert (420×70 statt 320×60)
- Container hat jetzt explizite Breite (180px) statt nur Höhe
- Verhindert dass Browser den Text abschneiden kann

**Problem 2: Portrait war zu dominant** ✓
- Portrait jetzt als **geblurrter Hintergrund-Akzent** rechts (40px Blur, 22% Opazität)
- Kreisförmig, abgedunkelt, mit screen-blend-mode
- Wirkt nur als subtile Brand-Präsenz, kein dominantes Foto mehr
- Inhalt steht weiterhin zentral im Vordergrund

## 📦 Was im ZIP

```
assets/
├── dirc_logo.svg        ← FIXED (größere viewBox)
├── dirc_portrait.jpg    ← bleibt (wird jetzt als Background genutzt)
├── style.css            ← FIXED (Portrait als subtiles BG)
└── legal.css            ← FIXED (Logo-Container mit fester Breite)

index.html               ← FIXED (neues Hero-Markup)
```

## 🚀 Upload (1 Min)

1. ZIP entpacken
2. **github.com/dirczahlmann/dircbot** → **Add file** → **Upload files**
3. Drag den Ordner-Inhalt rein
4. Bei Duplikaten: **Replace existing file**
5. Commit: `Fix logo cutoff, subtle portrait background`
6. **Cmd+Shift+R** auf der Seite

## 🎯 Was du sehen solltest

- **Logo** "Dirc Zahlmann+" komplett lesbar oben links (mit orange +)
- **Hero-Text** zentriert wie vorher
- **Subtiler oranger/blauer Schimmer** rechts im Hintergrund (das ist das geblurrede Portrait)
- Kein dominantes Foto mehr — alles harmonisch

Das Portrait wirkt jetzt als **Brand-Atmosphäre**, nicht als Show-Stopper. 🎯
