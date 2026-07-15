# GemButcher — Podere 173 Tattoo Studio

## Original Problem Statement
Build an ultra-modern, high-fidelity landing page + web app for "GemButcher" tattoo artist at Podere 173 (Ozieri, Italy) with:
- Interactive Three.js/WebGL 3D humanoid arm hero with 4 tattoo-style texture projection selector
- Patutikon horizontal scroll gallery
- Biography ("The Butcher's Craft")
- Inkanimus loyalty hub (Aftercare / Recruitment / Battle Royale tabs)
- Encrypted-style booking portal
- Multilingual ITA (default) / ENG
- Palette: matte obsidian black + cyan #00f0ff + magenta #ff007f
- Aesthetic: Dark Cyberpunk + Neo-Tokyo + Sacred Polynesian Geometry

## User Choices
- Loyalty hub data: simulated (localStorage)
- Booking form: saved to MongoDB + WhatsApp CTA
- 3D model: procedural humanoid arm (Three.js primitives)
- Gallery images: uploaded assets + curated Unsplash
- Language default: Italiano

## Architecture
- Frontend: React 19 + Tailwind + react-three-fiber + drei + framer-motion + sonner
- Backend: FastAPI + Motor (MongoDB async) — POST/GET /api/bookings, /api/status
- State: LangContext (i18n), localStorage for Inkanimus
- Fonts: Chakra Petch (heads), Manrope (body), JetBrains Mono (terminal), Rubik Mono One (kinetic)

## Personas
- Prospective client (Italy) — browses styles, reads bio, books session
- Returning client — uses Inkanimus loyalty hub for aftercare tracking + referral codes
- Community member — sees leaderboard, joins Battle Royale challenges

## Implemented (2026-02)
- [x] i18n IT/EN with 200+ keys, switcher in navbar
- [x] Hero with 3D procedural arm + 4-style texture switcher (polynesian/cyberpunk/anime/patutikon)
- [x] Kinetic marquee background text
- [x] Horizontal scroll gallery with 6 items + hover tooltip cards
- [x] Butcher's craft biography + studio card + neon map placeholder + stats
- [x] Inkanimus 3 tabs: Aftercare (7-day checklist tracker with streak), Recruitment (referral code gen + copy + ink-points balance + transaction log), Battle Royale (leaderboard + active challenge)
- [x] Booking portal (encrypted-terminal form) → POST /api/bookings + WhatsApp deep link
- [x] Holographic corner brackets, scanlines, clip-path frames, neon buttons
- [x] Footer with studio address

## Backlog
- P1: Custom .glb model integration if provided
- P1: Real WhatsApp number configuration
- P1: Admin dashboard for booking management
- P2: Email notifications (Resend/SendGrid)
- P2: Real leaderboard backend
- P2: Instagram feed integration
- P2: Portfolio detail pages

## 2026-02 · Pro Polish Pass
- Preloader cinematico HUD (Preloader.jsx) — 2.6s con logo glitch, glyph feed, progress bar
- Custom cursor neon a doppio strato (CustomCursor.jsx) — solo desktop, disabilitato per touch
- SoundEngine Web Audio API (SoundEngine.jsx) — SFX click/hover + ambient drone, muted by default, persistente in localStorage
- SEO completo: title, description, Open Graph, Twitter Card, JSON-LD `TattooParlor`, favicon SVG cyberpunk, sitemap.xml, robots.txt
- Accessibilità: `prefers-reduced-motion` disabilita tutte le animazioni; `:focus-visible` outline neon; `alt`/ARIA-friendly
