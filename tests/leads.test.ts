import test from "node:test";
import assert from "node:assert/strict";
import { formSchema, leadSchema, normalizePhone } from "../src/lib/lead-schema";
import { makeFormToken, validFormToken, verifyTurnstile } from "../src/lib/lead-security";
import { handleLead } from "../src/lib/lead-handler";
import { sanitizeLead, sheetColumns, sheetRow } from "../src/lib/leads";
const values = { fullName: "Test Visitor", phone: "9151112063", email: "visitor@example.com", buyerType: "", budget: "", plotSize: "", preferredVisitDate: "", message: "", website: "" };
const payload = () => ({ ...values, sourcePage: "http://localhost:3000/contact", consent: true, turnstileToken: "test-token", formToken: makeFormToken(Date.now() - 2000), requestId: crypto.randomUUID() });
const request = (body: unknown, origin = "http://localhost:3000") => new Request("http://localhost:3000/api/leads", { method: "POST", headers: { origin, "Content-Type": "application/json" }, body: JSON.stringify(body) });
function deps() {
  const map = new Map<string, string>(); let writes = 0; let ads = 0;
  return {
    map, get writes() { return writes; }, get ads() { return ads; },
    store: { get: async (k: string) => map.get(k) || null, set: async (k: string, v: string, _seconds: number, nx = false) => { if (nx && map.has(k)) return false; map.set(k, v); return true; }, remove: async (k: string) => { map.delete(k); }, limited: async () => false },
    verify: async () => true, persist: async () => { writes++; }, meta: async () => { ads++; },
  };
}
test("Indian phone normalization and strict validation", () => {
  assert.equal(normalizePhone("+91 91511 12063"), "+919151112063");
  assert.equal(normalizePhone("09151112063"), "+919151112063");
  assert.equal(formSchema.safeParse({ ...values, phone: "12345678" }).success, false);
  assert.equal(formSchema.safeParse({ ...values, fullName: "" }).success, false);
  assert.equal(leadSchema.safeParse({ ...payload(), unexpected: "x" }).success, false);
});
test("signed time trap rejects quick, expired, future and tampered tokens", () => {
  assert.equal(validFormToken(makeFormToken()), false);
  assert.equal(validFormToken(makeFormToken(Date.now() - 2000)), true);
  assert.equal(validFormToken(makeFormToken(Date.now() - 90_000_000)), false);
  assert.equal(validFormToken(makeFormToken(Date.now() + 10000)), false);
  assert.equal(validFormToken(makeFormToken(Date.now() - 2000) + "x"), false);
});
test("origin, oversized input, honeypot and failed CAPTCHA never persist", async () => {
  const d = deps();
  assert.equal((await handleLead(request(payload(), "https://evil.example"), d)).status, 403);
  assert.equal((await handleLead(request({ ...payload(), message: "x".repeat(17000) }), d)).status, 413);
  assert.equal((await handleLead(request({ ...payload(), website: "bot" }), d)).status, 400);
  assert.equal((await handleLead(request(payload()), { ...d, verify: async () => false })).status, 400);
  assert.equal(d.writes, 0);
});
test("persistence failure is retryable and never reports success or sends conversion", async () => {
  const d = deps();
  const response = await handleLead(request(payload()), { ...d, persist: async () => { throw Error("offline"); } });
  assert.equal(response.status, 503); assert.equal(d.ads, 0);
  assert.equal(response.headers.get("cache-control"), "no-store");
});
test("successful duplicate retries reuse one ID and one sheet insertion", async () => {
  const d = deps(); const p = payload();
  const one = await (await handleLead(request(p), d)).json();
  const two = await (await handleLead(request({ ...p, requestId: crypto.randomUUID() }), d)).json();
  assert.equal(one.ok, true); assert.equal(two.duplicate, true);
  assert.equal(one.leadId, two.leadId); assert.equal(d.writes, 1); assert.equal(d.ads, 1);
});
test("busy duplicate does not release another request's lock", async () => {
  const d = deps(); d.store.set = async () => false;
  let removed = false; d.store.remove = async () => { removed = true; };
  assert.equal((await handleLead(request(payload()), d)).status, 409); assert.equal(removed, false);
});
test("rate limited requests never reach verification", async () => {
  const d = deps(); d.store.limited = async () => true;
  assert.equal((await handleLead(request(payload()), d)).status, 429);
  assert.equal(d.writes, 0);
});
test("sheet rows exclude security tokens and neutralize formulas and URL queries", () => {
  const p = leadSchema.parse({ ...payload(), fullName: "=IMPORTXML(test)", sourcePage: "http://localhost:3000/?email=private" });
  const lead = sanitizeLead(p, "test-id");
  assert.equal(sheetRow(lead).length, sheetColumns.length);
  assert.equal(sheetRow(lead)[2].startsWith("'="), true);
  assert.equal(JSON.stringify(lead).includes("turnstileToken"), false);
  assert.equal(lead.sourcePage, "http://localhost:3000/");
});
test("Turnstile verifies action and hostname, fails on replay/invalid tokens", async () => {
  const original = global.fetch; const secret = process.env.TURNSTILE_SECRET_KEY;
  process.env.TURNSTILE_SECRET_KEY = "test-only";
  try {
    for (const [body, expected] of [[{ success: true, action: "enquiry", hostname: "localhost" }, true], [{ success: true, action: "other", hostname: "localhost" }, false], [{ success: true, action: "enquiry", hostname: "evil.example" }, false], [{ success: false, "error-codes": ["timeout-or-duplicate"] }, false]] as const) {
      global.fetch = async () => Response.json(body);
      assert.equal(await verifyTurnstile("test"), expected);
    }
  } finally { global.fetch = original; if (secret) process.env.TURNSTILE_SECRET_KEY = secret; else delete process.env.TURNSTILE_SECRET_KEY; }
});
