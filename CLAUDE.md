# CLAUDE.md — TYB Holdings Website

Agent-facing reference for this repo. Read this before editing anything. A shorter human-oriented overview lives in `WEBSITE-STRUCTURE.md`; this file is the authoritative one.

## 0. Keep this file current — required, every session

This file is worth reading only while it still matches the code, and a stale line here is worse than a missing one because the next agent trusts it. **Any structural change to the site updates this file as part of the same change, before the work is reported as done.** Structural means any of:

- a route added, removed, or renamed under `app/`
- a component added, removed, renamed, or moved under `components/`
- a dependency added to or removed from `package.json`
- a change to the translation shape: a new top-level `t.*` section, a renamed key, or a new count for any array in the §4 arity table
- a language added or removed
- a change to the palette, the page-header block, or the container/card conventions in §6
- a fix to anything listed in §8 — delete that entry rather than leave it describing a solved problem

Copy edits, wording changes, and styling tweaks inside an existing section are not structural. Leave this file alone for those.

Edit the affected section in place and delete what stopped being true; do not append change notes or a changelog at the end. When the change touches the file tree or the route list, `WEBSITE-STRUCTURE.md` needs the same edit.

## 1. What this project is

Static corporate marketing site for **TYB Holdings**, a Bangkok-based multi-industry group (rubber, metals, construction, brand partnerships). Five routes of hand-written marketing copy in three languages.

There is **no backend, database, API route, auth, CMS, or environment variable** in this project. Every route is static. If a task seems to require server state, say so before building it.

- **Next.js 15** App Router · **React 19** · **TypeScript** (strict) · **Tailwind CSS 3**
- **gsap** (hero animation), **d3** + **topojson-client** (world map), **lucide-react** (icons), **@radix-ui/react-slot** + **class-variance-authority** (Button)
- Deployed on **Vercel**; `vercel.json` pins the framework to `nextjs`. Production tracks `main`.

## 2. Commands and verification

```bash
npm run dev      # localhost:3000
npm run build    # the real check before claiming a change works
npx tsc --noEmit # fast type check; catches missing translation keys
```

**Do not run `npm run lint`.** The script exists but `eslint` and `eslint-config-next` are not in `package.json` and there is no eslint config, so `next lint` drops into an interactive installer that hangs a non-interactive shell. Type checking is the only working static check.

## 3. Repo map

```
app/
  layout.tsx            Root layout: all SEO metadata, Organization JSON-LD,
                        LanguageProvider + Header + <main> + SiteFooter
  page.tsx              "/"  hero (image showcase + right-edge globe) → intro
                        → world map → 4 link cards
  about/page.tsx        "/about"  header → body+3 divisions → values → timeline → mission
  businesses/page.tsx   "/businesses"  header → accordion of 3 categories
  relationships/page.tsx "/relationships"  header → Supported By | Trade Partners
  contact/page.tsx      "/contact"  header → address+email | mailto card
  globals.css           Tailwind layers, HSL theme vars, .map-pulse keyframes
  icon.png, apple-icon.png   Next.js file-convention icons

components/ui/
  header-2.tsx          Header + LanguageSwitcher + mobile menu   [exports Header]
  site-footer.tsx       Footer                                     [exports SiteFooter]
  language-context.tsx  LanguageProvider + useLanguage()
  world-map.tsx         d3 world map with gold markers + tooltip
  hero-globe.tsx        Greyscale rotating globe, centre pinned to the right edge,
                        with the trade network and its beams drawn on top
                        [default export; loaded via next/dynamic ssr:false]
  button.tsx            shadcn-style Button + buttonVariants (cva)
  menu-toggle-icon.tsx  Animated hamburger→arrow SVG
  use-scroll.ts         useScroll(threshold) → boolean
  demo.tsx              UNUSED — dead file
  cinematic-hero.tsx    UNUSED — dead file

lib/
  translations.ts       ALL site copy, en/zh/th. The content source of truth.
  locations.ts          The 13 trade locations + HQ, shared by world-map and hero-globe
  utils.ts             cn() = twMerge(clsx(...))

public/                served at the site root
  assets/docs/         PDFs and other customer downloads (see public/assets/README.md)
  assets/images/       photography and artwork
  assets/images/hero/  the four showcase images — PLACEHOLDER illustrations
  geo/                 countries-110m.json, served locally for the hero globe
  (root)               favicons, icons, TYB_logo.jpeg — fixed paths, leave in place
docs/                  domain, Search Console, SEO-migration, launch-QA checklists
PRD.md                 v1 product goals — written for the old single-page site

README.md              STALE — describes the deleted vanilla-HTML site
styles.css, script.js  STALE — leftovers of that site; nothing loads them
robots.txt, sitemap.xml  BROKEN LOCATION — at repo root, so Next.js never serves them
```

Import alias: `@/*` → repo root (`@/components/ui/header-2`, `@/lib/translations`).

## 4. The translation contract — the rule that governs everything

`lib/translations.ts` exports one object with three sibling keys, `en`, `zh`, `th`, of identical shape. `Translations` is typed as `typeof translations['en']`, so `en` is the schema and the other two must conform.

**No user-facing string is ever written in JSX.** Components call `const { t } = useLanguage()` and render `{t.section.key}`. When adding copy:

1. Add the key under `en`.
2. Add the same key under `zh` and `th` in the same edit.
3. Run `npx tsc --noEmit` — missing keys in `zh`/`th` surface as type errors there and nowhere else.

If you cannot produce real `zh`/`th` copy, add the English text as a placeholder and tell the user which keys need translation. Never leave a key absent from one language.

### Arity contracts

Several arrays are consumed positionally or sized by a fixed grid. Changing their length is a code change, not a copy change:

| Key | Count | Constraint |
|---|---|---|
| `map.locations` | **exactly 13** | **Index-aligned** with `TRADE_LOCATIONS` in `lib/locations.ts`. Entry *n* supplies the label for coordinate *n*. Both the flat world map and the hero globe read that table, so adding a city means coordinates there plus a label at the matching index in all three languages. |
| `hero.gallery.items` | **exactly 4** | **Index-aligned** with `HERO_IMAGES` in `app/page.tsx`. Entry *n* supplies the title and alt text for image *n*. Adding a showcase image means adding a file under `public/assets/images/hero/`, a path in that array, and an entry at the matching index in all three languages. |
| `about.divisions` | 3 | Rendered `md:grid-cols-3`; React key is the `number` string (`'01'`…). |
| `values.items` | 5 | Rendered `lg:grid-cols-5`; a 6th breaks the row. |
| `timeline.items` | 10 | 2-column grid; numbering is derived from array index, not stored. |
| `businesses.categories` | 3 | `id` is accordion state, **not** display text — keep `international-trade`, `constructions`, `partnerships` identical across all three languages. `international-trade` is open by default (`app/businesses/page.tsx`). |
| `businesses.categories[].items` | 4 each | React key is `title` — unique within a category. |
| `relationships.supportedBy.items` | 3 | React key is `name` — must be unique. |
| `relationships.partners.items` | 4 | React key is `name` — must be unique. |
| `footer.divisions` | 3 strings | React key is the string itself. |

Dead keys, present in all three languages but referenced nowhere: `hero.headline` (the hero renders `line1`/`line2`) and `footer.tagline`.

### Language state

`language` is React state in `components/ui/language-context.tsx`, initialised to `'en'`. It does **not** persist — a reload resets to English. There is no `?lang=` handling, no `localStorage`, no cookie, no i18n routing. Note the mismatch: `app/layout.tsx` advertises `alternates.languages['zh'] = '/?lang=zh'`, a URL nothing implements. Adding persistence means implementing that URL contract too.

## 5. Every page is a client component

All five `page.tsx` files start with `'use client'` because they consume the language context.

**Consequence: a page cannot export `metadata`.** Only `app/layout.tsx` does, so all five routes currently share one `<title>` and description. To give a route its own metadata, split it:

```
app/about/page.tsx      → server component, exports metadata, renders <AboutContent />
app/about/content.tsx   → 'use client', holds the JSX and useLanguage()
```

Because copy is per-language client state and metadata is static, per-route metadata can only be written in one language. Default to English and flag it.

## 6. Design system

**Brand colors are hardcoded hex**, not theme tokens — grep for them when changing the palette:

- `#0A1628` navy — hero, every interior page header, mission band, footer, map tooltip
- `#C9A84C` gold — kickers, hero accent line, CTA, map markers, footer accents
- `#EDF2FA` / `#F5F7FB` — light section backgrounds

Everything else uses Tailwind semantic tokens (`primary`, `foreground`, `muted-foreground`, `border`, `accent`) backed by HSL vars in `app/globals.css`. The `:root` palette is navy (hue 218).

The `.dark` block in `globals.css` is **dead**: it still holds green hues (hue 150) from a previous palette, and `tailwind.config.ts` sets no `darkMode`, so it can never apply. Do not extend it; delete it if you touch that file.

### Section rhythm to match

Every interior page opens with the same block — copy it verbatim for a new page:

```tsx
<section className="py-16 bg-[#0A1628] relative overflow-hidden">
  <div className="absolute inset-0 opacity-20" style={{
    backgroundImage: 'radial-gradient(circle, rgba(201,168,76,0.10) 1px, transparent 1px)',
    backgroundSize: '48px 48px',
  }} />
  <div className="relative z-10 container mx-auto max-w-6xl px-4 md:px-6">
    <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.3em] uppercase mb-3">{t.x.kicker}</p>
    <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">{t.x.headline}</h1>
  </div>
</section>
```

Then alternate `py-24 bg-white` and `py-24 bg-[#EDF2FA]` content sections. Containers are `container mx-auto max-w-6xl px-4 md:px-6` (`max-w-5xl` for narrower text, `max-w-7xl` for header/footer). Cards are `rounded-xl`/`rounded-2xl border border-border` with `hover:border-primary/40 hover:shadow-lg` transitions. Every section has a `kicker` (uppercase, wide tracking) above its heading.

## 7. Component notes

- **`Header`** — sticky, `z-50`. `useScroll(10)` swaps a solid white bar for a translucent blurred one. Active link via `usePathname()`: `/` matches exactly, others by `startsWith`. Locks `document.body.overflow` while the mobile menu is open, and closes the menu on route change.
- **The mobile menu must stay a sibling of `<header>`, never a child.** The scrolled header applies `backdrop-filter`, which creates a containing block that breaks `position: fixed` descendants. This was fixed in `92c72c0` and the reasoning is commented in the file — preserve the structure.
- **`LanguageSwitcher`** lives inside `header-2.tsx` (both desktop and mobile render one). Options are hardcoded there: adding a language means editing this array *and* `Language` in `lib/translations.ts` *and* adding a full translation object.
- **`WorldMap`** — takes its coordinates from `lib/locations.ts` (it no longer holds its own table). `useEffect` dynamically imports `d3` and `topojson-client`, then fetches `world-atlas@2/countries-110m.json` **from jsDelivr at runtime**. A failed fetch is swallowed and renders an empty box, so the map is blank offline. Rebuilds on a 250 ms-debounced window resize and on `locations` change (i.e. on language switch). Marker geometry, gradients, glow filter, and tooltip are all imperative d3; the pulse animation is the `.map-pulse` class in `globals.css`.
- **`HeroGlobe`** — the sphere is greyscale; the only colour on it is the trade network. It draws every location from `TRADE_LOCATIONS` as a node (the HQ in gold with two rings, the rest as pale dots), joins the HQ to each of the other twelve by a great-circle route, and runs a gold beam outward along one route after another (2.2s of travel, 1.0s apart, so ~2 are in the air and the set comes round every 12s). Nodes and beam heads are culled past the horizon and fade toward the limb, so roughly a third of each rotation faces the empty Pacific. Beams are motion, so they stop under `prefers-reduced-motion` while the routes and nodes stay. A real sphere, not a spun image: each frame advances `projection.rotate()` on a d3 `geoOrthographic` projection drawn to a 2-D canvas, so the land crosses a silhouette that never moves. Reuses the repo's existing `d3` + `topojson-client` (no graphics library was added) and needs no WebGL. Route samples are computed once, not per frame. One axial turn takes 100s. Geometry lives in the constants at the top of the file: the canvas box is a square whose centre sits on the container's right edge, so exactly half the sphere is on screen; `sideFor()` picks the square's side, switching to a stacked-band formula below 768px. It reads topology from `/geo/countries-110m.json` and falls back to jsDelivr, then to an ocean-only sphere; a CSS gradient sphere sits underneath as the static fallback. Spins only while on screen, tab-visible, and `prefers-reduced-motion` is not set. `aria-hidden`, so it never enters the focus order.
- **`Button`** — standard shadcn/cva component. Use `asChild` to wrap a `next/link`: `<Button asChild><Link href="/contact">…</Link></Button>`. `buttonVariants({ variant, size })` is used directly on `Link`s in the nav.
- **Logo** uses a plain `<img src="/TYB_logo.jpeg">` in both header and footer, not `next/image`.

## 8. Known-broken and dead weight

Fix these only when asked; do not let them mislead you.

1. **`robots.txt` and `sitemap.xml` sit at the repo root, so both 404 in production.** Next.js serves static files only from `public/`. Fix by moving them to `public/` or replacing them with `app/robots.ts` / `app/sitemap.ts`. The sitemap also still lists only the homepage from the single-page era and references the unimplemented `/?lang=zh`.
2. **`README.md` is stale** — its "Stack" and "Edit Guide" sections describe the vanilla HTML/CSS/JS site whose `index.html` was deleted in `6495b0c`. Do not follow it.
3. **`styles.css` and `script.js` are orphaned** from that same site. Nothing imports or loads them.
4. **`components/ui/demo.tsx` and `components/ui/cinematic-hero.tsx` are unreferenced.**
5. **`.DS_Store` is tracked** despite being gitignored, so `git status` is permanently dirty. Keep it out of commits (`git add` specific paths, never `git add -A`).
6. **All five routes share one title/description** — see §5.
7. **`PRD.md` scope is outdated** — it describes a single-page site with sections that no longer exist (Sustainability) and nav names since renamed.

## 9. Git and deploy

`main` is production; Vercel builds and deploys it automatically. Branches get preview URLs only. A `testing` branch exists for experiments. Branch before committing anything substantial, and do not push or commit unless the user asks.

## 10. Common tasks

- **Change wording** → `lib/translations.ts` only, all three languages. No component edit.
- **Add a section to an existing page** → add its keys to all three languages, then add the section to that `page.tsx` following §6's rhythm.
- **Add a page** → `app/<route>/page.tsx` with `'use client'`, a `t.<route>` translation block in all three languages, a link in the `links` array in `header-2.tsx`, and usually one in `site-footer.tsx`'s quick links. Consider the §5 split if it needs its own metadata.
- **Add a map city** → coordinates into `GEO` in `world-map.tsx` *and* a label at the same index in all three `map.locations` arrays.
- **Add a language** → `Language` union in `translations.ts`, a full fourth translation object, and the `options` array in `header-2.tsx`.
