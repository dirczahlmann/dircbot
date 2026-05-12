# DircBot v8.12 — Polish: Suggestion-Cards matchen Highlight-Card

## 🎯 Was neu ist in v8.12

### Suggestion-Cards visuell aufgewertet
Vorher: Generische dunkle Boxen mit dünnem grauen Border → wirkten unfertig neben der bunten Highlight-Card.

Jetzt: Suggestion-Cards bekommen **denselben Look** wie die Highlight-Card:
- **Topic-Color Border-Akzent** links (3px Strich, 0.55 opacity)
- **Subtiler Topic-Color Gradient** im Background (nur ca 5% Tint)
- **Topic-Color Border** (auch nur 18% Tint, dezent)
- **Hover**: Color-Tint wird kräftiger, Border voller, Box-Shadow mit Topic-Color, Akzent-Strich links wird voll opaque

### Highlight-Card spannt jetzt volle Breite
Vorher: Highlight-Card war "Spalte 1" im 2-Spalten-Grid → die ersten Suggestion-Cards quetschen sich rechts daneben rein → unsauberes Layout.

Jetzt: `grid-column: 1 / -1` → Highlight-Card spannt **volle Breite** über den 2x2 Suggestion-Cards. Sauberes Hierarchie:

```
┌─────────────────────────────────────────────────┐
│ 🔥 HEUTE AKTUELL                                │
│ [Highlight Tipp]                                │
│ [ACTION-Button]                                 │
└─────────────────────────────────────────────────┘
┌─────────────────────┐  ┌─────────────────────┐
│ Suggestion 1        │  │ Suggestion 2        │
└─────────────────────┘  └─────────────────────┘
┌─────────────────────┐  ┌─────────────────────┐
│ Suggestion 3        │  │ Suggestion 4        │
└─────────────────────┘  └─────────────────────┘
```

Alle 5 Karten haben jetzt **konsistentes Color-Coding** in der jeweiligen Topic-Farbe → visuell zusammenhängend.

---

## 🚀 Upload + Test

1. GitHub upload + Hard-Refresh
2. Klick auf ein Topic in der Top-Bar
3. **Heute-Highlight** oben, volle Breite, in Topic-Farbe ✓
4. **4 Suggestion-Cards** darunter mit Topic-Farben-Akzent ✓
5. Hover → Cards animieren mit Topic-Color-Glow ✓

---

## 📁 Files v8.12 (39 total — keine neuen)

Modified:
- `assets/style.css` — topic-suggestion-card v2 (Color-Akzent), highlight-card grid-column span
