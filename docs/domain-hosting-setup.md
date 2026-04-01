# Domain and Hosting Setup (Static Launch)

## Recommended Launch Path
- Host on GitHub Pages from this repository.
- Use current GitHub Pages URL first if needed: `https://eeeeqyq.github.io/TYB-Website/`.
- Connect custom domain as soon as purchased.

## 1) Buy Domain
- Preferred: short `.com` matching brand (example: `tyb-int.com`).
- Buy from a registrar with easy DNS management (Cloudflare Registrar, Namecheap, Porkbun, or GoDaddy).

## 2) Enable GitHub Pages
- In repository settings: Pages -> Deploy from branch.
- Select `main` branch and root folder (`/`).
- Confirm initial site loads on GitHub Pages URL.

## 3) Connect Custom Domain
- In GitHub Pages settings, set custom domain to either:
  - `www.yourdomain.com` (recommended canonical), or
  - `yourdomain.com`.
- Enable "Enforce HTTPS".

## 4) DNS Records
- If using `www` as canonical:
  - `CNAME` record: `www` -> `eeeeqyq.github.io`
  - Apex redirect (`@`) -> `https://www.yourdomain.com` via registrar/Cloudflare rule.
- If using apex as canonical:
  - Apex `A` records to GitHub Pages IPs (as documented by GitHub).
  - `CNAME` `www` -> `yourdomain.com` and redirect `www` to apex.

## 5) Canonical Host Rule
- Keep exactly one canonical URL format.
- Non-canonical host must 301 redirect to canonical host.

## 6) Verification Checklist
- HTTPS valid on canonical domain.
- Non-canonical host redirects correctly.
- Homepage loads with all CSS/JS/assets.
- `robots.txt` and `sitemap.xml` accessible on canonical domain.
