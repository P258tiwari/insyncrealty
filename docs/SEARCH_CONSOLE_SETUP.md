# Search Console

Canonical: https://insyncrealty.in. Redirect www to apex during the separate hosting phase.

1. Add a Domain property for insyncrealty.in in Search Console.
2. Copy its verification TXT record.
3. Add it at the authoritative DNS provider, then Verify after propagation.
4. Submit https://insyncrealty.in/sitemap.xml after publication.

No DNS changes were made.

Alternatively add an HTTPS URL-prefix property and set GOOGLE_SITE_VERIFICATION to its exact HTML meta token (not the whole tag), then rebuild. Next metadata outputs the tag.

Verify canonical URLs, robots, sitemap and indexing after deployment. Local tests do not prove ownership or live indexing.
