# Lighthouse Notes

Audit target:

- URL: `http://localhost:3001`
- Date: `2026-03-16`
- Command:

```bash
npx lighthouse http://localhost:3001 \
  --quiet \
  --chrome-flags='--headless --no-sandbox' \
  --only-categories=seo,accessibility,best-practices \
  --output=json \
  --output-path=./docs/lighthouse-report.json
```

Result summary:

- Accessibility: `1.00`
- Best Practices: `1.00`
- SEO: `1.00`

Resolved during the audit pass:

- Primary CTA buttons originally failed contrast checks.
- The accent palette was darkened until Lighthouse no longer reported any contrast failures.
