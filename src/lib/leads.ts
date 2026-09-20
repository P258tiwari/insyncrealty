import { JWT } from "google-auth-library";
import { createHash } from "node:crypto";
import type { LeadInput } from "./lead-schema";
export type Lead = Omit<LeadInput, "turnstileToken" | "formToken" | "website"> & { id: string; timestamp: string };
export function sanitizeLead(input: LeadInput, id: string): Lead {
  const { turnstileToken, formToken, website, ...values } = input;
  void turnstileToken; void formToken; void website;
  const cleanUrl = (s: string) => { if (!s) return ""; const u = new URL(s); return u.origin + u.pathname; };
  return { ...values, sourcePage: cleanUrl(values.sourcePage), referrer: cleanUrl(values.referrer), id, timestamp: new Date().toISOString() };
}
export const sheetColumns = ["Timestamp", "Lead ID", "Name", "Phone", "Email", "City", "Project", "Interest", "Budget", "Plot Size", "Visit Date", "Message", "Page URL", "Referrer", "UTM Source", "UTM Medium", "UTM Campaign", "UTM Content", "UTM Term", "GCLID", "FBCLID", "Consent Status", "Marketing Consent"];
const cell = (value: string) => /^[\s]*[=+@-]/.test(value) ? "'" + value : value;
export function sheetRow(lead: Lead) {
  return [lead.timestamp, lead.id, lead.fullName, lead.phone, lead.email, lead.city, lead.project, lead.buyerType, lead.budget, lead.plotSize, lead.preferredVisitDate, lead.message, lead.sourcePage, lead.referrer, lead.utmSource, lead.utmMedium, lead.utmCampaign, lead.utmContent, lead.utmTerm, lead.gclid, lead.fbclid, "Enquiry consent", lead.marketingConsent ? "Granted" : "Denied"].map(cell);
}
let auth: JWT | undefined;
async function sheetsRequest(range: string, method: "GET" | "POST", body?: unknown) {
  const { GOOGLE_SERVICE_ACCOUNT_EMAIL: email, GOOGLE_PRIVATE_KEY: key, GOOGLE_SHEET_ID: sheetId } = process.env;
  if (!email || !key || !sheetId) throw new Error("Lead storage configuration missing");
  auth ||= new JWT({ email, key: key.replace(/\\n/g, "\n"), scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
  const token = await auth.getAccessToken();
  const url = "https://sheets.googleapis.com/v4/spreadsheets/" + encodeURIComponent(sheetId) + "/values/" + encodeURIComponent(range) + (method === "POST" ? ":append?valueInputOption=RAW&insertDataOption=INSERT_ROWS" : "");
  const res = await fetch(url, { method, headers: { Authorization: "Bearer " + token.token, "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(10000), cache: "no-store" });
  if (!res.ok) throw new Error("Lead storage unavailable");
  return res.json();
}
const tabRange = () => "'" + (process.env.GOOGLE_SHEET_TAB || "Leads").replace(/'/g, "''") + "'";
export async function appendLeadToSheet(lead: Lead) {
  const existing = await sheetsRequest(tabRange() + "!B:B", "GET") as { values?: string[][] };
  if (existing.values?.some(row => row[0] === lead.id)) return;
  await sheetsRequest(tabRange() + "!A:W", "POST", { values: [sheetRow(lead)] });
}
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
export async function sendMetaLead(lead: Lead) {
  const { META_PIXEL_ID: pixel, META_CAPI_ACCESS_TOKEN: token, META_API_VERSION: version, META_TEST_EVENT_CODE: test } = process.env;
  if (!lead.marketingConsent || !pixel || !token || !version) return;
  if (!/^\d+$/.test(pixel) || !/^v\d+\.0$/.test(version)) throw new Error("Meta configuration invalid");
  const res = await fetch("https://graph.facebook.com/" + version + "/" + pixel + "/events", {
    method: "POST", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
    body: JSON.stringify({ data: [{ event_name: "Lead", event_time: Math.floor(Date.now() / 1000), event_id: lead.id, action_source: "website", event_source_url: lead.sourcePage, user_data: { ph: [hash(lead.phone.replace(/\D/g, ""))], ...(lead.email ? { em: [hash(lead.email)] } : {}) } }], ...(test ? { test_event_code: test } : {}) }),
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error("Meta delivery failed");
}
