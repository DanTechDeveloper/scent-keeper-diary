# Scent Keeper Diary

A daily fragrance companion — roll the dice to let fate choose your scent, clock in, and journal after a set deadline.

Built as a side project to learn React + TypeScript. Started from an AI-generated prototype, with manual modifications and additions to understand and improve the code.

## Features

- **Dice Roll** — randomly picks 1 or 2 fragrances from your collection with a shuffle animation
- **Timer-Gated Journal** — clock in when you spray, set a feedback deadline, and the journal only unlocks after the timer expires
- **Fragrance Collection** — add/edit/delete fragrances with name, brand, and notes. Optional URL-based name/brand extraction from Fragrantica, Parfumo, or Basenotes.
- **Search** — filter your collection by name or brand
- **Journal History** — past entries with occasion, feeling, rating, and comments
- **Layering Support** — roll for single wear or two-layer combos
- **Philippine Time** — all deadlines and displays use Asia/Manila
- **Client-Side Only** — all data in localStorage, no backend

## Tech Stack

- React 19 + Vite
- TypeScript
- Tailwind CSS v4
- shadcn/ui (Radix primitives)
- Lucide icons
- Sonner (toasts)

## Quick Start

```bash
npm install
npm run dev
```
