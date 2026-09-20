"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
declare global {
  interface Window {
    turnstile?: { render: (element: HTMLElement, options: Record<string, unknown>) => string; remove: (id: string) => void };
  }
}
export function Turnstile({ onToken, revision }: { onToken: (token: string) => void; revision: number }) {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  useEffect(() => {
    if (!ready || !sitekey || !container.current || !window.turnstile) return;
    const id = window.turnstile.render(container.current, { sitekey, action: "enquiry", appearance: "interaction-only", size: "flexible", callback: onToken, "expired-callback": () => onToken(""), "error-callback": () => { onToken(""); setFailed(true); } });
    return () => { window.turnstile?.remove(id); };
  }, [ready, sitekey, onToken, revision]);
  if (!sitekey) return <p className="text-sm" role="status">Online enquiries are being configured. Please try again later.</p>;
  return <><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={() => setReady(true)} onError={() => setFailed(true)}/><div ref={container}/>{failed && <p role="alert" className="text-sm">Verification could not load. Check your connection and refresh this page.</p>}</>;
}
