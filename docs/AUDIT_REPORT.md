# Pre-production audit — 20 September 2026

## Scope and outcome

Existing approved design preserved. Next.js 16.3.4, React, TypeScript and Tailwind. Confirmed domain https://insyncrealty.in, phone +91 91511 12063 and realtyinsync@gmail.com incorporated. No VPS/DNS/server work performed.

## Implementation

- All forms share full-width name, phone/email second row and preference third row. Labels, fields, placeholders and buttons have normal letter spacing. Heading line heights are 1.15/1.25.
- Server-side Sheets storage is mandatory for success; old false-success path removed. Turnstile, signed elapsed time, honeypot, strict schema, body cap, origin check, bounded local/shared Redis rate limiting and retry/duplicate protection added.
- Native dialog mobile menu and gallery support keyboard focus; native FAQ details reduce script cost. Forms expose errors through associated accessible descriptions and preserve values after failure.
- Single GTM path, optional consent, bounded session attribution and same-ID Meta browser/CAPI architecture. No production accounts connected.
- Security headers, scoped CSP, environment template, secret scan and GitHub CI added. Heavy googleapis/Resend and animation dependencies removed; official google-auth-library handles service-account authentication.
- Raster copies compressed from 46.9 MB to 6.3 MB before removing an unused image. Hero is eager/high priority; below-fold media is lazy. YouTube loads only on click. Unnecessary route prefetch and validation code at startup reduced.
- Per-page canonical/description/social metadata, confirmed organization schema, Search Console hook, robots and sitemap checked. Blog routes remain removed.

## Actual verification

- Backend tests: nine passing (normalization, strict validation, timing, origin/body/honeypot/CAPTCHA rejection, upstream failure, duplicate ID/write protection, lock ownership, rate limit, safe serialization, Siteverify hostname/action).
- Browser suite: ten passing, including five primary pages at 320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440 and 1920 pixels; WCAG A/AA axe checks; validation; mocked success and verification/server failures; consent.
- Eight-page browser audit: 14 unique internal links, no broken anchors/links, no console/page errors and no failing network requests. Mobile menu opens and Escape closes it.
- Production build, lint, typecheck and source secret scan passed. npm dependency audit found zero vulnerabilities at audit time.
- Original Lighthouse CLI report completed but its Windows temporary-profile cleanup failed; a managed-browser runner was added and subsequent measurement completed successfully.
- Final local mobile Lighthouse: Performance 92, Accessibility 100, Best Practices 100, SEO 100. FCP 1.1 seconds; simulated LCP 3.4 seconds; CLS 0; TBT 30 ms; Speed Index 1.3 seconds.
- LCP is still above the aspirational 2.5-second target. INP cannot be established from this lab run; field measurements are required. No live-host score or Core Web Vitals guarantee is claimed.

## External readiness

No real integration credentials are present. Google Sheets/service account, Turnstile, Redis/security secret, GTM/GA4/Ads, Search Console and Meta need the documented account configuration and live validation. Production submissions fail closed until configured. Automated external integrations were mocked; no real lead was written to Sheets and no ad conversion was sent.

The production domain is configured in source and the example environment; NEXT_PUBLIC_SITE_URL must still be supplied in the deployment environment. www canonical redirection is deferred to hosting.

## Limits

CSP permits inline Next hydration/styles; production excludes unsafe-eval. Google Sheets is not transactional: locks, stable IDs and reconciliation reduce ambiguous delayed-write duplicates but do not prove exactly-once delivery. CAPI failures are logged safely without a durable retry queue. Legal wording and unconfirmed project documentation retain their explicit review status.

## GitHub and deployment

Target: P258tiwari/insyncrealty, main. Remote was checked and was empty before preparing the first commit. Final Git commit/push evidence is provided in the delivery response. Local audit artifacts and private environment files are not committed.

VPS deployment intentionally NOT started. Ready for next deployment phase, subject to external configuration and live verification.