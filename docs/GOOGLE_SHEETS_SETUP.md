# Google Sheets setup

Status: implementation ready; credentials and a live account test required.

1. Open https://console.cloud.google.com/ and create/select the business project.
2. Enable Google Sheets API in APIs & Services.
3. In IAM & Admin > Service Accounts, create a dedicated website lead service account. Do not grant broad project-owner access.
4. In its Keys tab, create a JSON key and store the downloaded file securely outside this repository.
5. Copy its email and private key into server variables GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY. Escaped newlines in the key are supported. Never put this JSON in public assets or browser code.
6. Create/open the spreadsheet. Copy the ID between /d/ and /edit into GOOGLE_SHEET_ID.
7. Create a tab named Leads, or set GOOGLE_SHEET_TAB.
8. Share only this spreadsheet with the service-account email as Editor.
9. Add these exact headers in A1:W1:

Timestamp, Lead ID, Name, Phone, Email, City, Project, Interest, Budget, Plot Size, Visit Date, Message, Page URL, Referrer, UTM Source, UTM Medium, UTM Campaign, UTM Content, UTM Term, GCLID, FBCLID, Consent Status, Marketing Consent

10. Configure Turnstile, LEAD_SECURITY_SECRET and Redis as described in SECURITY.md. Set NEXT_PUBLIC_SITE_URL to the exact browser origin (production: https://insyncrealty.in).
11. Restart; rebuild when changing NEXT_PUBLIC_ variables.
12. Send one clearly marked enquiry using an authorized test contact.
13. Verify exactly one row appears and the browser confirms success. Repeat within ten minutes and confirm no duplicate row. Separately test upstream failure and confirm no false success.

Writes use RAW values and formula-like text is additionally prefixed. Security tokens and raw IPs are excluded. URL query/hash data is removed. Reading the Lead ID column before writing reconciles prior ambiguous timeouts. Sheets is not transactional: an extremely delayed upstream write can still race a retry. Redis locks and stable IDs reduce this risk; use a transactional database/outbox for strict exactly-once or high-volume requirements.

References:
- https://developers.google.com/identity/protocols/oauth2/service-account
- https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append
