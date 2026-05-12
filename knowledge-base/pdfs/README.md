# PDF Knowledge-Base — Drop your PDFs here

Files in this folder are automatically read and injected into DircBot's system prompt on every chat.

## How it works

1. **Drop PDFs in this folder** (e.g. `00_sales-master-deck.pdf`, `01_crypto-framework.pdf`)
2. **Commit + push** to GitHub
3. **Netlify auto-deploys** — Bot now knows your PDFs

## Naming conventions

- Use a sortable prefix (`00_`, `01_`, `02_`...) so important files load first
- Use hyphens or underscores instead of spaces
- Use descriptive names — the filename becomes a section header in the Bot's context

Example:
```
00_sales-master-framework.pdf       ← Most important, loaded first
01_crypto-portfolio-system.pdf
02_wealth-allocation-templates.pdf
03_swiss-tokenization-deep-dive.pdf
```

## Limits

- **Total token budget: 80,000 tokens** (~60,000 words, ~120 PDF pages combined)
- If you exceed the budget, later PDFs get truncated (warning in logs + Admin)
- **API cost per chat goes UP** when more KB is loaded (more input tokens)
- Estimate: every additional 1000 tokens = ~€0.003/message extra cost
- At full 80k budget: ~€0.25/message → still profitable at €50 subscription, but margins shrink

## What gets extracted

- **Text PDFs** ✓ — full text extracted via `pdf-parse`
- **Scanned PDFs** ✗ — empty (no OCR currently). Need to OCR first via Adobe Acrobat or similar
- **Tables** — extracted as text but may lose formatting
- **Images** — ignored (not yet supported, would need vision model)

## Checking what's loaded

Open Admin → "📚 Wissensbasis" — see all loaded files with token counts and budget status.

## When you outgrow Static-Inject (50+ PDFs total)

Switch to RAG (Retrieval-Augmented Generation). Talk to Claude when you're ready — 5-day build, $25/month recurring.

## ⚠️ DO NOT add

- Confidential client documents (these go into the system prompt of every user's chat!)
- Real contracts with personal data
- Anything you wouldn't want every Tester to potentially see fragments of in answers

Only put **content you'd happily share** — your frameworks, decks, templates, training material.
