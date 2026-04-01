# Next.js Migration SEO Checklist (Future)

## Keep URL Stability
- Keep homepage URL unchanged.
- Preserve section anchors if externally referenced.

## Preserve Metadata Semantics
- Carry over title and meta description exactly (or improve carefully).
- Keep canonical URL consistent with final domain.
- Preserve Open Graph and Twitter metadata parity.
- Keep Organization JSON-LD with same entity fields.

## Recreate Crawl Files in Next.js
- Implement `app/robots.ts` with sitemap pointer.
- Implement `app/sitemap.ts` with canonical URLs.

## Redirect Strategy
- If any path changes, add permanent 301 redirects.
- Test redirects before cutover.

## Migration Validation
- Compare old vs new rendered `<head>` output.
- Re-submit sitemap after go-live.
- Use Search Console URL Inspection for homepage.
- Monitor index coverage and ranking volatility for 2-4 weeks.
