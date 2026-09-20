import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1"],
  async headers() {
    const dev = process.env.NODE_ENV !== "production";
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'" + (dev ? " 'unsafe-eval'" : "") + " https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://connect.facebook.net https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://www.google.com https://www.google.co.in https://googleads.g.doubleclick.net https://www.facebook.com https://i.ytimg.com",
      "font-src 'self'",
      "connect-src 'self'" + (dev ? " ws://localhost:3000 ws://127.0.0.1:3000" : "") + " https://*.google-analytics.com https://www.google-analytics.com https://www.googletagmanager.com https://www.google.com https://www.google.co.in https://googleads.g.doubleclick.net https://www.googleadservices.com https://www.facebook.com https://challenges.cloudflare.com",
      "frame-src https://www.youtube-nocookie.com https://www.youtube.com https://www.google.com https://www.googletagmanager.com https://challenges.cloudflare.com",
      "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'",
    ].join("; ");
    return [{ source: "/:path*", headers: [
      { key: "Content-Security-Policy", value: csp },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
    ] }, { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] }];
  },
};

export default nextConfig;
