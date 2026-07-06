# Scent Keeper Diary

A daily fragrance companion — roll the dice to let fate choose your scent, clock in, and unlock journaling after a set deadline. Built for fragrance enthusiasts who want to rotate their collection and log honest, experience-based impressions.

## Key Features

- **Dice Roll** — randomly picks 1 or 2 fragrances from your collection with a shuffle animation
- **Timer-Gated Journal** — clock in when you spray, set a feedback deadline, and the journal only unlocks after the timer expires. No snap reviews.
- **Fragrance Collection** — add/edit/delete fragrances with name, brand, and notes. Optional URL-based name/brand extraction.
- **Journal History** — past entries with occasion, feeling, rating, and comments
- **Layering Support** — roll for single wear or two-layer combos
- **Philippine Time** — all deadlines and displays use Asia/Manila regardless of system timezone
- **Purely Client-Side** — everything in localStorage, no backend needed

## Tech Stack

- React 19 + Vite
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Lucide icons
- Sonner (toasts)

## Why This Project Stands Out

- **Opinionated UX** — the timer-gated journal forces real wear time before reviewing, showing product thinking beyond CRUD
- **Timezone Handling** — properly stores UTC but displays in PH timezone using `Intl.DateTimeFormat`, with correct deadline construction accounting for UTC offsets and day wrapping
- **Scraper Simplification** — started with a proxy-based Fragrantica scraper, hit Cloudflare blocks, and pivoted to a simpler URL-extraction approach. The decision-making process (what didn't work, why, and the final trade-off) is documented in the scraper module.
- **State Architecture** — localStorage-backed persistence with a `TodayState` type that tracks the full daily flow: roll → clock in → deadline → journal unlock → save

## Quick Start

```bash
npm install
npm run dev
```
