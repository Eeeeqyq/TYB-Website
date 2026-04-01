# Google Search Console Setup

## Property Setup
- Open Google Search Console and add a new property.
- Use **Domain** property for long-term tracking (`yourdomain.com`) once domain is purchased.
- If domain is not ready yet, add a temporary **URL Prefix** property:
  - `https://eeeeqyq.github.io/TYB-Website/`

## Verification
- Preferred method for domain property: DNS TXT record at your registrar.
- Wait for DNS propagation, then click Verify.

## Submit Sitemap
- In Search Console -> Sitemaps, submit:
  - `https://eeeeqyq.github.io/TYB-Website/sitemap.xml`
- After custom domain is live, submit the canonical-domain sitemap URL.

## Request Indexing
- Use URL Inspection on homepage URL.
- Click Request indexing.

## Monitor (Weekly)
- Indexing -> Pages: watch for excluded/error pages.
- Enhancements and Experience reports: track usability warnings.
- Search results report: monitor impressions/clicks for brand terms.

## After Domain Go-Live
- Add and verify domain property if only URL-prefix was used initially.
- Update canonical, sitemap, robots, and schema URLs from GitHub Pages URL to custom domain.
