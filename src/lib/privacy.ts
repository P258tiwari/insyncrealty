export type Consent = { analytics: boolean; marketing: boolean };
export const consentKey = "insync-consent-v1";
export function getConsent(): Consent {
  try { const value = JSON.parse(localStorage.getItem(consentKey) || "{}"); return { analytics: value.analytics === true, marketing: value.marketing === true }; }
  catch { return { analytics: false, marketing: false }; }
}
const attributionKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"] as const;
export function captureAttribution() {
  const consent = getConsent();
  if (!consent.analytics && !consent.marketing) { try { sessionStorage.removeItem("insync-attribution"); } catch {} return; }
  try {
    const params = new URLSearchParams(location.search);
    const saved = JSON.parse(sessionStorage.getItem("insync-attribution") || "{}");
    for (const key of attributionKeys) {
      if ((key === "gclid" || key === "fbclid") && !consent.marketing) { delete saved[key]; continue; }
      const value = params.get(key);
      if (value) saved[key] = value.replace(/[<>\u0000-\u001f]/g, "").slice(0, key.endsWith("clid") ? 250 : 150);
    }
    sessionStorage.setItem("insync-attribution", JSON.stringify(saved));
  } catch { /* Storage can be disabled. */ }
}
export function readAttribution() {
  captureAttribution();
  try {
    const a = JSON.parse(sessionStorage.getItem("insync-attribution") || "{}");
    return { utmSource: a.utm_source || "", utmMedium: a.utm_medium || "", utmCampaign: a.utm_campaign || "", utmTerm: a.utm_term || "", utmContent: a.utm_content || "", gclid: a.gclid || "", fbclid: a.fbclid || "" };
  } catch { return {}; }
}
