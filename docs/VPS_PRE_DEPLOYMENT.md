# Future VPS phase — documentation only

No SSH, VPS, DNS, Nginx, SSL, PM2, systemd or production database changes are part of this delivery.

- Use Node.js 24 LTS and npm ci. Supply server secrets securely; build with final public variables.
- Verify Turnstile hostname/action, Sheets permissions, Redis and an authorized live test lead.
- Bind Node to loopback behind HTTPS. Redirect www to https://insyncrealty.in while preserving query strings.
- Overwrite X-Real-IP; block direct Node access before enabling TRUST_PROXY.
- Never cache /api/*, POST responses or private lead data.
- Preserve Next's immutable cache for /_next/static/* hashed assets. Preserve framework /_next/image behavior with query-aware cache keys.
- Unhashed /images/* need revalidation or a short TTL, NOT immutable caching.
- Keep dynamic contact/form responses out of proxy full-page caching. Static pages can use framework defaults.
- Validate HTTPS/redirects/headers before HSTS. max-age=31536000 is appropriate only after HTTPS is stable; includeSubDomains/preload need a separate domain review.
- Later configure supervision, log rotation, monitoring, resource limits, backups and least filesystem privilege. Logs must exclude keys, tokens and raw leads.
- Run live mobile, performance, consent, tracking and Sheets tests, with a rollback plan.

Missing credentials block deployment, not ordinary code builds. See .env.example.
