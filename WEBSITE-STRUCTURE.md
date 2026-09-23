# TYB Holdings Website

Corporate marketing site for TYB Holdings (Bangkok-based trading/construction group). Next.js 15 App Router, React 19, Tailwind 3, TypeScript. No backend, no database, no auth — every route is static marketing content. Deployed on Vercel; production tracks `main`.

Scripts are in `package.json`. Import alias: `@/*` → repo root.

## Assets

Hand-uploaded files live under `public/assets/` — `docs/` for PDFs and downloads, `images/` for photography. That folder's path is its URL: `public/assets/docs/x.pdf` is served at `/assets/docs/x.pdf`. See `public/assets/README.md`.

## Routes

Five pages, each a folder under `app/`: `/` (hero — a business-image showcase on the left with a right-edge rotating globe (`components/ui/hero-globe.tsx`) — then intro, world map, link cards), `/about`, `/businesses`, `/relationships`, `/contact`. `app/layout.tsx` wraps all of them in `LanguageProvider`, `<Header />`, `<SiteFooter />`.

## All copy lives in `lib/translations.ts`

Three parallel objects — `en`, `zh`, `th` — with identical shapes. Pages read strings through `useLanguage()` and render `{t.section.key}`; **no user-facing string is ever written in JSX.** Adding or renaming a key means editing all three language objects in the same commit, or the site breaks in the untouched languages (`Translations` is typed off `en`, so `zh`/`th` gaps surface as type errors — run `npx tsc --noEmit`).

Language is React state only (`components/ui/language-context.tsx`). It resets to `en` on reload — no URL param, no `localStorage`. The root metadata advertises an `hreflang` for `/?lang=zh`, but nothing reads that param; wiring persistence means wiring that URL contract too.

## Every page is a client component

`'use client'` sits at the top of all five pages because they consume the language context. Consequence: **a page cannot export `metadata`** — only `app/layout.tsx` does, so all five routes currently share one title and description. To give a route its own metadata, split it: a server `page.tsx` that exports `metadata` and renders a `'use client'` child holding the content.

## Visual conventions

Two brand colors are hardcoded as hex across components, not themed: `#0A1628` (navy, used for the hero, page headers, mission band, footer) and `#C9A84C` (gold, used for kickers and accents). Everything else goes through the Tailwind semantic tokens (`primary`, `muted-foreground`, `border`, …) defined as HSL vars in `app/globals.css`.

Each interior page opens with the same block: a `py-16 bg-[#0A1628]` section holding a dot-pattern overlay, a gold uppercase `kicker`, and an `<h1>` — then alternates white and `#EDF2FA` / `#F5F7FB` content sections. Match that rhythm when adding a page.

The `.dark` block in `app/globals.css` is dead: it holds green hues from a previous palette, and `tailwind.config.ts` sets no `darkMode`. Ignore it rather than extending it.

## Gotchas

- **The mobile menu must stay a sibling of `<header>`, never a child.** The scrolled header applies `backdrop-filter`, which creates a containing block that breaks `position: fixed` descendants. `components/ui/header-2.tsx` carries the comment; keep the structure.
- **`robots.txt` and `sitemap.xml` sit at the repo root, so Next.js does not serve them** — both 404 in production. Fixing means moving them into `public/` or replacing them with `app/robots.ts` / `app/sitemap.ts`. The sitemap also still lists only the homepage, from the single-page era.
- **`README.md`, `styles.css`, and `script.js` describe a site that no longer exists** — the original vanilla HTML/CSS/JS version, whose `index.html` was deleted in `6495b0c`. Do not treat the README's "Stack" or "Edit Guide" sections as current.
- **`components/ui/demo.tsx` and `components/ui/cinematic-hero.tsx` are unreferenced.** Nothing imports them.
- **`.DS_Store` is tracked** despite being gitignored, so `git status` is permanently dirty. Leave it out of commits.
- **The world map fetches its topology from jsDelivr at runtime** (`world-atlas@2/countries-110m.json`), and `d3` / `topojson-client` are dynamically imported inside the effect to keep the bundle small. It renders nothing offline.

## Background

`PRD.md` holds the v1 product goals (written for the static single-page launch, so its scope section is outdated). `docs/` holds the domain, Search Console, SEO-migration, and launch-QA checklists.
