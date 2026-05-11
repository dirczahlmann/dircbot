# 🔥 DircBot — Split-Layout Hero (v7)

## ✅ Was neu ist

**Option A umgesetzt:**
- Hero ist jetzt **2-spaltig** (Desktop)
- Text + Headline links auf dunklem Hintergrund
- **Scharfes Portrait** rechts (NICHT mehr geblurrt!)
- Sanfter Gradient-Übergang in der Mitte (Foto schmilzt links ins Dunkel)
- Foto erstreckt sich vom oberen bis unteren Rand des Hero-Bereichs
- Mobile: stackt automatisch (Foto oben, Text unten)

## 📦 Files im ZIP

```
assets/
├── dirc_portrait_sharp.jpg    ← NEU (scharfes Portrait, 236 KB, 899×1200)
├── dirc_logo.svg              ← bleibt
├── style.css                  ← FIXED (Split-Layout)
└── legal.css                  ← bleibt

index.html                      ← FIXED (neues Hero-Markup)
```

Die alten Portrait-Files (`dirc_portrait.jpg`, `dirc_portrait_bg.jpg`) kannst du auf GitHub
einfach drinlassen — werden nicht mehr genutzt, schaden aber auch nicht.

## 🚀 Upload (1 Min)

1. ZIP entpacken
2. **github.com/dirczahlmann/dircbot** → **Add file** → **Upload files**
3. Drag den Ordner-Inhalt rein
4. Bei Duplikaten: **Replace existing file**
5. Commit: `Split-layout hero with sharp portrait`
6. **Cmd+Shift+R**

## 🎯 Was du sehen wirst

**Desktop (>820px breit):**
- Linke Spalte: Logo, Live-Demo-Label, Headline "Sprich mit DircBot Genau Jetzt", Untertitel
- Rechte Spalte: Dein scharfes Portrait, bildschirmfüllend
- In der Mitte: sanfter Gradient-Fade (Foto in Dunkel übergehend)

**Mobile (<820px):**
- Foto oben (volle Breite, 380px hoch)
- Sanfter Fade nach unten
- Text darunter zentriert
- Logo oben links wie immer

## 🛡️ Falls's nicht direkt klappt

Hard refresh nicht vergessen: **Cmd+Shift+R**

Sieht's komisch aus, mach einen Screenshot — ich justiere dann.

---

Nach Deploy → endlich Topic-Sidebar! 🔥
