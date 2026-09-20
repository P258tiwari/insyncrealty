# Tracking setup

## One browser architecture: GTM

Set only NEXT_PUBLIC_GTM_ID in the app. Configure GA4, Google Ads and Meta Pixel IDs inside that container; no parallel hardcoded tags exist.

Consent Mode v2 defaults are denied before GTM loads. GTM loads only after an optional category is accepted. The footer control allows changes. Withdrawal updates consent and reloads to unload tags. Essential security does not depend on optional consent.

Create GTM Data Layer Variables (version 2): event_id, project, page_path, analytics_consent, marketing_consent.

1. GA4: enter the real G- measurement ID in a Google tag. Require analytics_storage and analytics_consent equals true. Set send_page_view=false and disable enhanced-measurement history page views.
2. Trigger GA4 page_view on the app event of the same name. Use sanitized page_path. Configure page_location from origin + page_path, excluding queries/hash. Never send contact data or arbitrary query parameters.
3. Custom events: lead_form_view, lead_form_start, form_validation_error, lead_error, click_whatsapp, click_phone, cta_click. lead_submit is an attempt, NOT a conversion.
4. generate_lead is emitted only after confirmed persistence and not on deduplicated retries. Mark it as a GA4 key event.
5. Google Ads: create a real website lead conversion. Put its Conversion ID and Label into a GTM Conversion Tracking tag triggered only on generate_lead with marketing consent. Use event_id for transaction ID. Add a consent-aware Conversion Linker.
6. Meta Pixel: configure one vetted GTM template/tag with the real Pixel ID. Require marketing_consent equals true on EVERY trigger. On generate_lead send standard Lead using eventID equal to the dataLayer event_id. Never include name/email/phone/message in browser events.
7. Test accept, reject, category-only, withdrawal, navigation and a successful enquiry in GTM Preview, GA4 DebugView, Ads diagnostics and Meta Test Events. Publish the container only after verification.

## Meta CAPI

READY — CREDENTIAL REQUIRED. Configure server-only META_PIXEL_ID, META_CAPI_ACCESS_TOKEN and an account-supported META_API_VERSION from current Meta documentation. META_TEST_EVENT_CODE is optional for testing.

The server sends standard Lead with the SAME persisted ID as the browser. Phone is normalized to digits and email trimmed/lowercased, then SHA-256 hashed. Advertising consent is required. Tokens never reach the browser. Meta failure does not undo storage; a sanitized warning is logged. There is no durable advertising retry queue.

## Attribution

UTM source/medium/campaign/content/term, GCLID and FBCLID are length-limited and cleaned. Session storage requires optional consent; click IDs require marketing consent. Full URL queries/referrers are not forwarded wholesale.

Required account setup: GTM, GA4 measurement ID, Ads conversion ID/label, Meta Pixel ID, CAPI token/version. No IDs or successful connections are fabricated.

Reference: https://developers.google.com/tag-platform/security/guides/consent
