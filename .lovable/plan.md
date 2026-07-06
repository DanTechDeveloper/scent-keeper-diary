
# ScentOfTheDay — Build Plan

A single-user, no-auth web app for fragrance lovers to manage their collection, let fate pick today's scent, log when they wore it, and journal the experience. All data persists in `localStorage`.

## Design direction

Modern-minimal luxury: warm off-white background (`#faf7f2`), deep ink foreground, muted champagne/gold accent, generous whitespace, serif display headings (e.g. Cormorant / Instrument Serif) paired with a clean sans (Inter/Work Sans) for body. Subtle hairline dividers, soft shadows, no purple gradients.

## App structure (routes)

Single-page tabbed layout under `/` (TanStack route `index.tsx`):

- **Collection** — CRUD fragrances
- **Today's Scent** — dice roll + time-in unlock
- **Journal** — history of past entries

Shared header with the "ScentOfTheDay" wordmark and tab nav.

## Data model (localStorage)

```
sotd:fragrances  -> Fragrance[]
sotd:today       -> TodayState | null
sotd:journal     -> JournalEntry[]
sotd:occasions   -> string[]   // user-added occasions for combobox
```

Types:

- `Fragrance { id, name, brand?, notes?, house?, createdAt }`
- `TodayState { date: 'YYYY-MM-DD', layers: 1|2, picks: Fragrance[], rolledAt, timeIn?: ISO, journalId?: string }`
- `JournalEntry { id, date, fragranceIds[], occasion, feeling, rating (1-5), comment, createdAt }`

## Feature details

### 1. Collection CRUD
- List view (cards, name + brand + notes).
- Add/Edit dialog: name (required), brand, house (e.g. designer/niche), notes (top/heart/base as freeform textarea).
- Delete with confirm dialog.
- Empty state prompting to add first fragrance.

### 2. Roll the Dice — "Accept the Fate"
- Layer selector: **1 Layer** (single scent) or **2 Layer** (two scents, e.g. layered combo).
- "Roll" button uses `Math.random()` to pick from collection. For 2-layer, picks two distinct fragrances (requires ≥2 in collection).
- After roll: result is **locked** — button becomes disabled, replaced with "Fate Accepted" state showing today's pick(s). No re-roll UI.
- Locked per calendar day (based on `TodayState.date`). New day = fresh roll allowed.
- Dice animation: brief scale/fade shuffle through names for ~1.2s before settling.
- Guard: needs ≥1 fragrance (1-layer) or ≥2 (2-layer).

### 3. Time-In Unlock
- After roll is locked, a **"Clock In"** button appears. Clicking stamps `timeIn` with `new Date().toISOString()` (actual current time — not user-editable).
- Displays current date and the stamped time-in.
- Journal entry form is **disabled until Clock In is pressed**.
- Once clocked in, cannot be un-clocked.

### 4. Journal
- Unlocked only after clock-in on Today's Scent tab.
- Form fields:
  - **Occasion** — combobox (shadcn Command in Popover): user picks from previously used occasions or types a new one; new values persist to `sotd:occasions`.
  - **Feeling** — textarea "What did you feel about this fragrance?"
  - **Rating** — 1–5 star selector.
  - **Comment** — optional textarea.
- Save creates a `JournalEntry` linked to today's pick(s) and stores `journalId` on `TodayState`.
- Once saved for today, form becomes read-only summary card.
- Journal tab lists all past entries newest-first (date, fragrance name(s), occasion, rating, feeling excerpt), with click-to-expand for full comment.

## Files to create / touch

- `src/styles.css` — replace tokens with luxury palette + serif/sans font pair, add Google Fonts `<link>` in `__root.tsx` head.
- `src/routes/__root.tsx` — update title/description/OG to "ScentOfTheDay", add font stylesheet link.
- `src/routes/index.tsx` — main app shell with tabs.
- `src/lib/sotd-storage.ts` — typed localStorage helpers + types.
- `src/components/sotd/CollectionTab.tsx`
- `src/components/sotd/FragranceDialog.tsx`
- `src/components/sotd/TodayTab.tsx`
- `src/components/sotd/DiceRoller.tsx`
- `src/components/sotd/JournalForm.tsx`
- `src/components/sotd/JournalTab.tsx`
- `src/components/sotd/OccasionCombobox.tsx`
- `src/components/sotd/StarRating.tsx`
- `public/robots.txt` + `src/routes/sitemap[.]xml.ts` per setup recipe.

## Tech notes

- Pure client-side; no Lovable Cloud needed.
- Uses shadcn components already scaffolded (Dialog, Button, Input, Textarea, Tabs, Card, Command, Popover, Badge, Sonner for toasts).
- All colors via semantic tokens; no hardcoded hex in components.
