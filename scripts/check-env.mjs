import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());
const required = ["NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_TURNSTILE_SITE_KEY", "TURNSTILE_SECRET_KEY", "LEAD_SECURITY_SECRET", "REDIS_URL", "GOOGLE_SHEET_ID", "GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY"];
const optional = ["GOOGLE_SHEET_TAB", "TRUST_PROXY", "NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL", "NEXT_PUBLIC_GTM_ID", "GOOGLE_SITE_VERIFICATION", "META_PIXEL_ID", "META_CAPI_ACCESS_TOKEN", "META_API_VERSION", "META_TEST_EVENT_CODE"];
for (const name of [...required, ...optional]) console.log(name + " — " + (process.env[name]?.trim() ? "PRESENT" : required.includes(name) ? "MISSING" : "OPTIONAL"));
if (required.some(name => !process.env[name]?.trim())) process.exitCode = 1;
if (process.env.LEAD_SECURITY_SECRET && process.env.LEAD_SECURITY_SECRET.length < 32) { console.error("LEAD_SECURITY_SECRET must have at least 32 characters."); process.exitCode = 1; }
if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.startsWith("1x000") || process.env.TURNSTILE_SECRET_KEY?.startsWith("1x000")) { console.error("Test Turnstile keys must not be used for deployment."); process.exitCode = 1; }
