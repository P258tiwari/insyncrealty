import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const routes = ["/", "/about", "/projects", "/projects/santushti-enclave", "/contact"];
for (const route of routes) {
  test("responsive and semantic audit " + route, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto(route);
    await expect(page.locator("h1")).toHaveCount(1);
    await page.getByRole("button", { name: "Reject", exact: true }).click();
    for (const width of [320,360,375,390,414,430,768,1024,1280,1440,1920]) {
      await page.setViewportSize({ width, height: 900 });
      const overflow = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth > document.documentElement.clientWidth, bad: [...document.querySelectorAll("main h1, main h2, main h3, form input:not([aria-hidden]), form select, main button")].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1); }).map(e => e.textContent?.slice(0, 50) || e.tagName) }));
      expect(overflow, "width " + width).toEqual({ doc: false, bad: [] });
    }
    expect(errors).toEqual([]);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
  });
}
test("navigation, form validation and server failures", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Reject", exact: true }).click();
  await page.getByRole("button", { name: "Request a Callback" }).click();
  await expect(page.getByText("Please enter your full name.")).toBeVisible();
  await page.getByLabel("Full Name *", { exact: true }).fill("Test Visitor");
  await page.getByLabel("Mobile Number *", { exact: true }).fill("12345");
  await page.getByRole("button", { name: "Request a Callback" }).click();
  await expect(page.getByText("Enter a valid 10-digit Indian mobile number.")).toBeVisible();
  await page.getByRole("link", { name: "Projects", exact: true }).first().click();
  await expect(page).toHaveURL(/\/projects$/);
});
for (const outcome of ["success", "verification", "unavailable"]) {
  test("mocked enquiry " + outcome, async ({ page }) => {
    test.skip(!process.env.E2E_TURNSTILE, "Requires a build with the official public Turnstile test site key.");
    await page.route("https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", route => route.fulfill({
      contentType: "application/javascript",
      body: "window.turnstile={render:function(el,options){setTimeout(function(){options.callback('mock-browser-token')},10);return 'mock-widget';},remove:function(){}};",
    }));
    let received: Record<string, unknown> | undefined;
    await page.route("**/api/leads", async route => {
      if (route.request().method() === "GET") return route.fulfill({ json: { formToken: "mock-form-token" } });
      received = route.request().postDataJSON();
      return route.fulfill({ status: outcome === "success" ? 200 : outcome === "verification" ? 400 : 503, json: outcome === "success" ? { ok: true, leadId: "mock-confirmed-lead", duplicate: false } : { message: outcome === "verification" ? "Verification expired or failed. Please verify again." : "We could not confirm your enquiry. Please try again shortly." } });
    });
    await page.goto("/contact");
    await page.getByRole("button", { name: "Accept all", exact: true }).click();
    await page.getByLabel("Full Name *", { exact: true }).fill("Test Visitor");
    await page.getByLabel("Mobile Number *", { exact: true }).fill("9151112063");
    await page.getByRole("button", { name: "Request a Callback" }).click();
    if (outcome === "success") await expect(page.getByRole("heading", { name: "Thank you." })).toBeVisible();
    else {
      await expect(page.locator("form").getByRole("alert")).toContainText(outcome === "verification" ? "Verification expired" : "could not confirm");
      await expect(page.getByLabel("Full Name *", { exact: true })).toHaveValue("Test Visitor");
    }
    expect(received?.turnstileToken).toBe("mock-browser-token");
    const events = await page.evaluate(() => (window.dataLayer || []).filter((item: unknown) => item && typeof item === "object" && "event" in item && item.event === "generate_lead"));
    expect(events).toHaveLength(outcome === "success" ? 1 : 0);
  });
}
test("consent defaults deny and can be changed", async ({ page }) => {
  await page.goto("/");
  expect(await page.locator('script[src*="googletagmanager"]').count()).toBe(0);
  await page.getByRole("button", { name: "Manage preferences", exact: true }).click();
  await page.getByLabel("Analytics", { exact: true }).check();
  await page.getByRole("button", { name: "Save preferences" }).click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("insync-consent-v1") || "{}"))).toEqual({ analytics: true, marketing: false });
});
