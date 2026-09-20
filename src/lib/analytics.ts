import { getConsent } from "./privacy";
declare global { interface Window { dataLayer?: unknown[] } }
export type AnalyticsEvent = "lead_form_view" | "lead_form_start" | "lead_submit" | "lead_success" | "generate_lead" | "form_validation_error" | "lead_error" | "whatsapp_click" | "phone_click" | "click_whatsapp" | "click_phone" | "cta_click" | "project_view" | "brochure_click" | "site_visit_click" | "page_view";
export function trackEvent(event: AnalyticsEvent, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const consent = getConsent();
  if (!consent.analytics && !consent.marketing) return;
  const allowed = ["project", "event_id", "page_path", "link_type"];
  const safe = Object.fromEntries(Object.entries(data).filter(([key]) => allowed.includes(key)));
  window.dataLayer ||= [];
  window.dataLayer.push({ event, ...safe, analytics_consent: consent.analytics, marketing_consent: consent.marketing });
}
