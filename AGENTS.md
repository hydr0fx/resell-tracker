# Flippy Bird – Projektkontext

## Goal
Private reselling-tracking PWA (Flippy Bird) for managing purchases, sales, profits, and preparing items for Kleinanzeigen posting (no auto-posting/scraping/botting).

## Architecture
- Pure client-side PWA (single HTML file, ~1340 lines)
- No backend, no tunnels, no credit card needed
- localStorage for all data persistence
- Hosted on GitHub Pages: `https://hydr0fx.github.io/flippy-bird/`

## Tech Stack
- Vanilla JS (no frameworks)
- CSS custom properties for theming
- PWA via manifest.json + sw.js (cache v3.1.0)

## Features
- **Dashboard:** Gewinn, Aktive, Ø Marge stats + recent items
- **Inventory:** Filter/sort/search items, status chips
- **Add/Edit:** Images upload, auto title/desc generation, profit calculator, PayPal fee calculator, shipping cost selector (DHL/Hermes/DP), accessories/defects
- **Detail:** Photo viewer with zoom/rotate/download, status buttons, edit/export/delete
- **KA Export:** Preview card, copy buttons for title/price/desc/all, "Kleinanzeigen öffnen" link, "Als inseriert markieren"
- **Sales:** Skyscanner-style month grid (3×4), year nav, profit popup, select mode for bulk sold marking
- **Settings:** Standard-Standort, Standard-Footer
- **Dark Mode:** Instant toggle in header (🌙/☀️)

## Color Scheme
- Gold accent: #FACC15
- Dark mode: bg #0F0F0F, card #1A1A2E, text #F0F0F0
- Positive: #22C55E, Danger: #EF4444

## Key Constraints
- NO automatic posting to Kleinanzeigen (only prepare + copy)
- NO backend/tunnel/hosting requiring credit card
- Mobile-first, single-file architecture

## File Structure
- `index.html` – Complete PWA (CSS + HTML + JS)
- `manifest.json` – PWA manifest
- `sw.js` – Service worker (network-first, cache fallback)
- `icon-192.png`, `icon-512.png`, `apple-icon.png` – App icons
- `splash-bird.png` – Splash animation image
- `SESSION.md` – Session log
- `AGENTS.md` – This file (project context for AI)
