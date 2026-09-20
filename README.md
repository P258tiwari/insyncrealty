# Insync Realty

Approved navy/blue real-estate website built with Next.js App Router, React, TypeScript and Tailwind. Includes homepage, company information, project listing/detail, contact and legal pages. Blog functionality is intentionally removed.

## Requirements and commands

Node.js 24 LTS, npm, Git. Use the committed lockfile.

- Install: npm ci
- Development: npm run dev
- Typecheck: npm run typecheck
- Lint: npm run lint
- Backend tests: npm test
- Build: npm run build
- Production server: npm start
- E2E: npx playwright install chromium, then npm run test:e2e
- Security scan: npm run scan:secrets
- Dependency audit: npm audit

Copy .env.example to .env.local. For local form submissions use NEXT_PUBLIC_SITE_URL=http://localhost:3000. Public variables are build-time values. Never commit real secrets. The website can build without integration secrets; enquiry submission fails safely until security and Sheets are configured.

The production domain is https://insyncrealty.in; www should redirect to apex in the separate deployment phase.

## Tests

Unit tests mock external verification/storage and cover validation, timing, origin, rate limit, locking, duplicate handling, storage failure and serialization. E2E tests use a production build on port 3100, verify important pages at eleven widths, accessibility and form behavior. Set PW_CHANNEL=msedge to use locally installed Edge, or install Playwright Chromium. Browser test results do not prove production integration credentials work.

## Integrations and operations

- [Google Sheets](docs/GOOGLE_SHEETS_SETUP.md)
- [Tracking and consent](docs/TRACKING_SETUP.md)
- [Search Console](docs/SEARCH_CONSOLE_SETUP.md)
- [Security](docs/SECURITY.md)
- [Later VPS deployment](docs/VPS_PRE_DEPLOYMENT.md)
- [Audit record](docs/AUDIT_REPORT.md)

## Content and assets

Company/contact details: src/content/company.ts. Confirmed phone and email are configured; unverified hours have been removed. Project content: src/content/projects.ts. Supplied/AI-generated visuals are illustrative, not proof of delivered infrastructure. Plan/brochchure/legal facts still require owner-approved material; no unsupported claims have been invented.

Images are compressed WebP copies delivered through Next Image with responsive sizes. Original PNG working files remain local and are excluded from Git. scripts/optimize-images.mjs can regenerate WebP copies when original sources are present. The LCP image is eager/high priority; below-fold images are lazy.

## Delivery

Repository: https://github.com/P258tiwari/insyncrealty

No VPS deployment or server/DNS changes are included in this phase. Live credentials, account verification and real-user performance checks are required before launch.
