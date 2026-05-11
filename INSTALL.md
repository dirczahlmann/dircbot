# DircBot v8.7 — Pricing-Modell + Sidebar Fixed-Top + Personalized Daily

## 🎯 Was neu ist in v8.7

### 1. 💎 Pricing-Modell-Section im Admin
Komplett ausgearbeitete Empfehlung für €50/Monat-Subscription mit 25% Affiliate:

**Subscription:** €50/Monat → 500 Nachrichten inklusive
- Profit avg (200 msgs/User): €28.70 (57% Marge)
- Profit worst (500 msgs/User): €18.20 (36% Marge)

**Top-Up-Pakete** (nach 500 verbraucht, keine Affiliate-Provision):
- **SMALL** — +100 msgs / €7 (€0.07/msg, 46% Marge)
- **MEDIUM ⭐** — +300 msgs / €18 (€0.06/msg, 37% Marge) ← Sweet Spot
- **LARGE** — +1000 msgs / €50 (€0.05/msg, 27% Marge)

Komplette Breakdown im Admin → "💎 Pricing-Modell".

### 2. 📐 Sidebar-Layout: Topics fixed top, Chats scrollable bottom
Vorher: Topics wurden bei vielen Chats nach unten geschoben — verschwanden aus dem View.
Jetzt: 
- **Oben (fixed):** New Chat, Daily Focus, Profile-Card, **Topics** — bleiben IMMER sichtbar
- **Unten (scrollable):** Chat-Verlauf scrollt in seinem eigenen Container
- Section-Label "Meine Chats" ist sticky beim Scrollen

### 3. ✨ Daily Focus personalisiert
Vorher: Generischer Topic-Tip aus statischer Tipps-Liste
Jetzt: Wenn Profil existiert, zeigt das Widget direkt **DEIN ZIEL** im Goal-Block:

```
✦ DEIN FOKUS HEUTE           Crypto & Blockchain
┌─────────────────────────────────────────┐
│ DEIN ZIEL                                │
│ in 12 Monaten ein Haus kaufen für 1.5M  │
│ [side-hustle]                            │
└─────────────────────────────────────────┘
Ein konkreter Schritt näher heute.
Der Bot pickt basierend auf deinem ganzen Kontext.
[Hol meinen Plan →]
```

Beim Klick generiert der Bot einen personalisierten 3-Schritte-Plan für genau DEINE Situation (dein Job, dein Ziel, dein Improvement-Goal, dein Stage).

### 4. 🔢 Cost-Calculator Defaults aktualisiert
Default Input-Tokens jetzt 8500 (statt 2800) — realistisch mit 12 KB-Files + Profile + Memories + Conversation History injection.

---

## 🚀 Upload + Test

1. GitHub upload (36 Files)
2. Auto-Deploy + Hard-Refresh (Cmd+Shift+R)

### Test-Flow
1. `dircbotDebug.reset()` → frisch starten
2. 3 Free + DIRC500 → Profile mit Beruf + Improvement-Ziel ausfüllen
3. **Sidebar checken:** New Chat / Daily Focus / Profile / Topics oben fixiert. Chats darunter scrollbar.
4. **Daily Focus checken:** zeigt jetzt dein Ziel + Stage statt generischer Tipp
5. Klick "Hol meinen Plan" → Bot bekommt vollen Profile-Kontext, gibt personalisierten Plan
6. **Admin → "💎 Pricing-Modell"** — komplette Preisstrategie + Top-Ups + Profit-Breakdown

---

## 💼 Was du jetzt brauchst für Launch

**Variant B (server-side)** ist Voraussetzung für €50-Verkauf:
- Echte Quota pro User (nicht via Inkognito umgehbar)
- Stripe-Integration für Subscription + Top-Ups
- Per-User-Token-Tracking
- Affiliate-Dashboard für Partner

Das ist ein 2-3 Wochen Build. Wenn du soweit bist sag Bescheid — dann planen wir den V2-Backend.

