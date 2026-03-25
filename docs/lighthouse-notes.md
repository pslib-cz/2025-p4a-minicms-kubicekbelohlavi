# Lighthouse Notes

Audit target:

- URL: `http://localhost:3002`
- Date: `2026-03-25`
- Lighthouse: `13.0.3`
- Command:

```bash
npx lighthouse http://localhost:3002 \
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

- Re-ran the audit after the magazine redesign and Czech copy cleanup.
- Public remote images now use per-image `unoptimized` delivery, which removed the `/_next/image` timeout and `500` console errors seen during the first post-redesign audit attempt.
