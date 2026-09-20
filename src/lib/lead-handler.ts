import { leadSchema } from "./lead-schema";
import { appendLeadToSheet, sanitizeLead, sendMetaLead } from "./leads";
import { fingerprint, makeFormToken, originAllowed, requestIp, securityStore, validFormToken, verifyTurnstile } from "./lead-security";
const defaults = { store: securityStore, verify: verifyTurnstile, persist: appendLeadToSheet, meta: sendMetaLead };
const reply = (status: number, body: object) => Response.json(body, { status, headers: { "Cache-Control": "no-store", ...(status === 429 ? { "Retry-After": "600" } : {}) } });
async function readBody(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new Error("media");
  const reader = request.body?.getReader(); if (!reader) throw new Error("json");
  let size = 0; const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { value, done } = await reader.read(); if (done) break;
      size += value.byteLength; if (size > 16384) { await reader.cancel(); throw new Error("size"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
export async function initializeForm(request: Request) {
  try {
    if (await securityStore.limited("init:" + fingerprint(requestIp(request)), 30, 600)) return reply(429, { ok: false });
    return reply(200, { formToken: makeFormToken() });
  } catch { return reply(503, { message: "Enquiries are temporarily unavailable. Please try again later." }); }
}
export async function handleLead(request: Request, deps = defaults) {
  if (!originAllowed(request)) return reply(403, { message: "Please submit from this website." });
  let lock: string | undefined;
  try {
    if (await deps.store.limited("rate:" + fingerprint(requestIp(request)))) return reply(429, { message: "Too many attempts. Please try again in ten minutes." });
    let body: unknown;
    try { body = await readBody(request); }
    catch (error) { return reply(error instanceof Error && error.message === "size" ? 413 : 400, { message: "Please review the form and try again." }); }
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) return reply(400, { message: "Please review the form fields." });
    const input = parsed.data;
    if (input.website || !validFormToken(input.formToken)) return reply(400, { message: "Please refresh the form and try again." });
    if (new URL(input.sourcePage).origin !== new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").origin) return reply(400, { message: "Please submit from this website." });
    if (!await deps.verify(input.turnstileToken)) return reply(400, { message: "Verification expired or failed. Please verify again." });
    // Same contact + project + requirement is a duplicate for ten minutes.
    const key = "lead:" + fingerprint([input.phone, input.email, input.project, input.buyerType, input.plotSize, input.budget, input.preferredVisitDate, input.message].join("|"));
    const lockKey = key + ":lock";
    if (!await deps.store.set(lockKey, "1", 120, true)) return reply(409, { message: "Your enquiry is already being processed. Please wait a moment." });
    lock = lockKey;
    const existing = await deps.store.get(key);
    const record = existing ? JSON.parse(existing) as { id: string; done: boolean } : { id: fingerprint(input.requestId).slice(0, 32), done: false };
    if (record.done) return reply(200, { ok: true, leadId: record.id, duplicate: true });
    // Retain pending ID on upstream failure so retries can reconcile with Sheets.
    await deps.store.set(key, JSON.stringify(record), 600);
    const lead = sanitizeLead(input, record.id);
    await deps.persist(lead);
    await deps.store.set(key, JSON.stringify({ ...record, done: true }), 600);
    try { await deps.meta(lead); } catch { console.error("[leads] Meta delivery failed; lead remains stored"); }
    return reply(200, { ok: true, leadId: lead.id, duplicate: false });
  } catch {
    console.error("[leads] submission unavailable; no payload logged");
    return reply(503, { message: "We could not confirm your enquiry. Your details are still here; please try again shortly." });
  } finally {
    if (lock) { try { await deps.store.remove(lock); } catch { /* Lock expires automatically. */ } }
  }
}
