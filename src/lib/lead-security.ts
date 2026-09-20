import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { createClient } from "redis";
const localSecret = randomBytes(32).toString("hex");
function secret() {
  if (process.env.NODE_ENV === "production" && (process.env.LEAD_SECURITY_SECRET?.length || 0) < 32) throw new Error("Security configuration missing");
  return process.env.LEAD_SECURITY_SECRET || localSecret;
}
export function fingerprint(value: string) { return createHmac("sha256", secret()).update(value).digest("hex"); }
export function makeFormToken(now = Date.now()) {
  const body = now + "." + randomBytes(12).toString("hex");
  return body + "." + fingerprint(body);
}
export function validFormToken(token: string, now = Date.now()) {
  const [time, nonce, signature, extra] = token.split(".");
  if (extra || !time || !nonce || !signature || !/^[a-f0-9]{64}$/.test(signature)) return false;
  const elapsed = now - Number(time);
  return elapsed >= 1200 && elapsed <= 86_400_000 && timingSafeEqual(Buffer.from(signature), Buffer.from(fingerprint(time + "." + nonce)));
}
const memory = new Map<string, { value: string; expires: number }>();
let redis: ReturnType<typeof createClient> | undefined;
let connecting: Promise<unknown> | undefined;
async function client() {
  if (!process.env.REDIS_URL) {
    if (process.env.NODE_ENV === "production") throw new Error("Shared security store missing");
    return;
  }
  if (!redis) {
    redis = createClient({ url: process.env.REDIS_URL, socket: { connectTimeout: 3000, reconnectStrategy: false } });
    redis.on("error", () => console.error("[leads] security store unavailable"));
  }
  if (!redis.isOpen) {
    connecting ||= redis.connect().finally(() => { connecting = undefined; });
    await connecting;
  }
  return redis;
}
function prune() {
  for (const [key, item] of memory) if (item.expires <= Date.now()) memory.delete(key);
  if (memory.size >= 10000) throw new Error("Security store capacity reached");
}
export const securityStore = {
  async get(key: string) {
    const db = await client(); if (db) return db.get(key);
    prune(); return memory.get(key)?.value || null;
  },
  async set(key: string, value: string, seconds: number, onlyIfAbsent = false) {
    const db = await client();
    if (db) return !!(await db.set(key, value, { EX: seconds, ...(onlyIfAbsent ? { NX: true } : {}) }));
    prune(); if (onlyIfAbsent && memory.has(key)) return false;
    memory.set(key, { value, expires: Date.now() + seconds * 1000 }); return true;
  },
  async remove(key: string) {
    const db = await client(); if (db) await db.del(key); else memory.delete(key);
  },
  async limited(key: string, limit = 5, seconds = 600) {
    const db = await client();
    if (db) {
      const count = await db.eval("local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n", { keys: [key], arguments: [String(seconds)] });
      return Number(count) > limit;
    }
    prune(); const item = memory.get(key); const count = Number(item?.value || 0) + 1;
    memory.set(key, { value: String(count), expires: item?.expires || Date.now() + seconds * 1000 });
    return count > limit;
  },
};
export function requestIp(request: Request) {
  // Reverse proxy must overwrite X-Real-IP and prevent direct origin access.
  return process.env.TRUST_PROXY === "true" ? request.headers.get("x-real-ip")?.trim().slice(0, 64) || "unknown" : "local";
}
export function originAllowed(request: Request) {
  return request.headers.get("origin") === new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").origin;
}
export async function verifyTurnstile(token: string) {
  const key = process.env.TURNSTILE_SECRET_KEY;
  if (!key) throw new Error("Bot verification configuration missing");
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: key, response: token }), signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("Bot verification unavailable");
  const data = await response.json() as { success?: boolean; hostname?: string; action?: string };
  const hostname = new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").hostname;
  return data.success === true && data.hostname === hostname && data.action === "enquiry";
}
