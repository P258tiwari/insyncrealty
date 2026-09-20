import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
const skip = new Set(["node_modules", ".next", ".git", ".npm-cache", "audit-artifacts", "test-results", "playwright-report", "backups"]);
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => skip.has(e.name) ? [] : e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const staged = process.argv.includes("--staged");
const files = staged ? execFileSync("git", ["diff", "--cached", "--name-only", "--diff-filter=ACM"], { encoding: "utf8" }).trim().split(/\r?\n/).filter(Boolean) : walk(".");
const findings = [];
for (const file of files) {
  const base = path.basename(file);
  if (base.startsWith(".env") && base !== ".env.example") { if (staged) findings.push(file + ": environment file"); continue; }
  if (/\.(png|webp|jpg|woff2?|ico|tsbuildinfo)$/i.test(file) || base === "package-lock.json" || file.includes("scan-secrets")) continue;
  const s = fs.readFileSync(file, "utf8");
  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(s) || /"private_key"\s*:\s*"[^"]+/.test(s) || /(?:AIza[0-9A-Za-z_-]{30,}|gh[pousr]_[A-Za-z0-9]{30,}|EA[A-Za-z0-9]{90,})/.test(s)) findings.push(file + ": credential signature");
  if (/^(?:META_CAPI_ACCESS_TOKEN|TURNSTILE_SECRET_KEY|GOOGLE_PRIVATE_KEY|REDIS_URL)\s*=\s*\S+/m.test(s) && base !== ".env.example") findings.push(file + ": nonempty secret assignment");
}
console.log(JSON.stringify({ filesScanned: files.length, findings }, null, 2));
if (findings.length) process.exitCode = 1;
