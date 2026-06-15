# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

All commands run from `frontend/`:

```bash
npm run dev      # dev server at localhost:3000
npm run build    # production build
npm run start    # production server
npm run lint     # ESLint
```

## Architecture

**LuxeStay** — luxury travel booking platform. Next.js 16 frontend only (no backend yet; project name hints at future SQL backend).

### Stack
- Next.js 16 + React 19 (App Router)
- TypeScript 5 (strict mode)
- Tailwind CSS v4 (`@tailwindcss/postcss`)
- Lenis (`src/components/SmoothScroll.tsx`) wraps entire app for smooth scroll

### Route Structure
```
src/app/
  (auth)/          # Route group — no layout segment in URL
    login/
    signup/
    verify/
    forgot/
    reset/
  bookings/        # My Bookings dashboard
  resorts/         # Explore resorts
  search/          # Search results with filters
  help/            # Help center + FAQ
  layout.tsx       # Root layout — applies SmoothScroll, Google Material Symbols
  page.tsx         # Landing page
```

All pages are `"use client"`. No API routes exist yet.

### Design System (globals.css — Tailwind v4 theme)
- **Primary**: `#006591` (navy), **Primary Container**: `#0ea5e9` (sky blue)
- **Background/Surface**: `#f8f9ff`
- **Display font**: Plus Jakarta Sans (700/800); **Body font**: Inter
- Key utility classes: `.glass-panel` (frosted glass), `.hero-gradient`, `.card-shadow`
- Grid: 12-col, base unit 8px, gutters 24px
- Cards: `rounded-3xl` (24px), hover scale/translate transitions

### Path Aliases
`@/*` → `src/*`

### Data
All page data is hardcoded in component files — no API calls, no data fetching layer.
