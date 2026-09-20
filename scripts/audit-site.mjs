import { chromium } from "@playwright/test";
import fs from "node:fs";
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || "msedge", headless: true });
const page = await browser.newPage();
const errors = [], network = [], reports = [];
page.on("pageerror", e => errors.push(e.message));
page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
page.on("response", r => { if (r.status() >= 400) network.push({ url: r.url(), status: r.status() }); });
const routes = ["/", "/about", "/projects", "/projects/santushti-enclave", "/contact", "/privacy-policy", "/terms", "/disclaimer"];
for (const route of routes) {
  const response = await page.goto("http://localhost:3100" + route);
  const data = await page.evaluate(() => ({
    title: document.title, canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    description: document.querySelector('meta[name="description"]')?.getAttribute("content"),
    h1: document.querySelectorAll("h1").length,
    schema: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => JSON.parse(s.textContent)),
    links: [...document.querySelectorAll("a[href]")].map(a => a.getAttribute("href")),
    unsafeBlank: [...document.querySelectorAll('a[target="_blank"]')].filter(a => !a.rel.includes("noopener")).map(a => a.href),
    resources: performance.getEntriesByType("resource").map(r => ({ name:r.name, bytes:r.transferSize })),
  }));
  reports.push({ route, status: response.status(), headers: await response.allHeaders(), ...data });
}
const broken = [];
const links = new Set(reports.flatMap(r => r.links).filter(h => h.startsWith("/")));
for (const href of links) {
  const u = new URL(href, "http://localhost:3100");
  const response = await page.goto(u.href);
  if (response.status() >= 400) broken.push(href);
  if (u.hash && !(await page.locator('[id="' + decodeURIComponent(u.hash.slice(1)) + '"]').count())) broken.push(href + " (missing anchor)");
}
await page.goto("http://localhost:3100/");
await page.setViewportSize({ width: 390, height: 844 });
await page.getByRole("button", { name: "Reject", exact: true }).click();
await page.getByRole("button", { name: "Open menu" }).click();
const mobileMenu = await page.getByRole("dialog", { name: "Navigation menu" }).isVisible();
await page.keyboard.press("Escape");
const menuClosed = !(await page.getByRole("dialog", { name: "Navigation menu" }).isVisible());
fs.writeFileSync("audit-artifacts/site-audit.json", JSON.stringify({ reports, errors, network, broken, mobileMenu, menuClosed }, null, 2));
console.log(JSON.stringify({ pages: reports.length, internalLinks: links.size, errors, network, broken, mobileMenu, menuClosed }));
await browser.close();
if (errors.length || broken.length || reports.some(r=>r.status!==200 || r.h1!==1 || r.unsafeBlank.length)) process.exitCode=1;
