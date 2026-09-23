# Website assets

Everything a person uploads by hand lives here. Files in `public/` are served from the
site root, so this folder's path is also its URL:

| Put it here | It is reachable at |
|---|---|
| `public/assets/docs/profile.pdf` | `/assets/docs/profile.pdf` |
| `public/assets/images/port.jpg` | `/assets/images/port.jpg` |

## `docs/` — PDFs and other downloads

Drop the file in, then link to it. `download` makes the browser save it instead of
opening it in a tab:

```tsx
<a href="/assets/docs/profile.pdf" download>...</a>
```

Name files the way a customer should see them on their desktop:
`tyb-company-profile.pdf`, not `final_v3(1).pdf`.

## `images/` — photography and artwork

`images/hero/` holds the four homepage showcase images. Those four are **placeholder
illustrations** — the repository has no photography of real TYB sites. To swap in real
photos, overwrite the files keeping the same names, or edit `HERO_IMAGES` in
`app/page.tsx` if the names change. Either way the count must stay at four and stay
index-aligned with `hero.gallery.items` in `lib/translations.ts`, including the alt text
in all three languages.

Wide 16:9 assets suit the hero. Compress before committing — git keeps every version of
a binary file forever, so a 12 MB photo replaced five times costs 60 MB of repository
weight that deleting the file will not reclaim.

GitHub rejects any single file over 100 MB.

## What does not belong here

`public/geo/` holds map topology data, and the favicons sit at the root of `public/`
because browsers and `app/layout.tsx` expect them at fixed paths.
