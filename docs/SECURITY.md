# Security

GET /api/leads issues a signed timestamp. POST /api/leads checks origin, a streamed 16 KiB limit, a strict shared Zod schema, honeypot, signed elapsed time (1.2 seconds minimum, 24-hour expiry), Turnstile Siteverify hostname/action, rate limits and a ten-minute duplicate window. Stable IDs and a two-minute Redis lock protect retries. Only confirmed Sheets persistence returns success. API responses are no-store; logs exclude raw leads, IPs, tokens and upstream exceptions.

## Production configuration

- NEXT_PUBLIC_SITE_URL=https://insyncrealty.in.
- Cloudflare managed Turnstile widget for insyncrealty.in. Public NEXT_PUBLIC_TURNSTILE_SITE_KEY and secret TURNSTILE_SECRET_KEY. Client action is enquiry with interaction-only appearance.
- LEAD_SECURITY_SECRET: securely generated random value of at least 32 bytes, stable across instances.
- REDIS_URL: private access-restricted Redis, preferably TLS. Production fails closed without it. Development uses a bounded TTL memory store, unsuitable for multiple processes.
- TRUST_PROXY=true only after the proxy overwrites X-Real-IP and direct origin access is blocked. Otherwise all callers share a local rate bucket.
- Google Sheets variables in GOOGLE_SHEETS_SETUP.md.

Limits: five submissions and thirty initializations per ten minutes per HMAC-derived IP key. No raw IP enters Sheets. No CAPTCHA bypass flag exists.

## Headers and CSP

Named Google, Meta, Cloudflare and YouTube hosts are allowed, plus self/data/blob where needed. object-src none, base-uri self, form-action self, frame-ancestors none, DENY fallback, nosniff, strict-origin-when-cross-origin and restricted Permissions Policy are applied.

Exception: script-src unsafe-inline supports Next static hydration; style-src unsafe-inline supports React/motion styles. Production excludes unsafe-eval. Nonces force dynamic rendering; migrate to nonces/build hashes and remeasure if a stricter policy is required. This CSP is not a complete inline-XSS defense. React renders user text safely; JSON-LD escapes less-than characters. There is no arbitrary user HTML renderer.

HSTS belongs to the later HTTPS host configuration, after certificate/subdomain validation. No server was configured.

Enquiry consent is separate from marketing consent. CAPI sends hashes only with advertising consent; hashes remain personal data. Establish spreadsheet retention/access/deletion rules and legal review. A banner alone does not guarantee legal compliance.

Checks: npm audit; npm run lint; npm run typecheck; npm test; npm run build; npm run test:e2e; npm run scan:secrets.

Limitations: Sheets is not transactional; stable IDs and reconciliation reduce but do not mathematically eliminate ambiguous delayed-write duplicates. CAPI is best effort with no durable retry queue.

Reference: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
