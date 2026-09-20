"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution, consentKey, getConsent, type Consent } from "@/lib/privacy";
import { trackEvent } from "@/lib/analytics";
let initialized = false;
// Google's command queue expects an Arguments object, not a custom event object.
// eslint-disable-next-line prefer-rest-params
function command(...args: unknown[]) { window.dataLayer ||= []; void args; window.dataLayer.push(arguments); }
function applyConsent(value: Consent) {
  command("consent", "update", { analytics_storage: value.analytics ? "granted" : "denied", ad_storage: value.marketing ? "granted" : "denied", ad_user_data: value.marketing ? "granted" : "denied", ad_personalization: value.marketing ? "granted" : "denied" });
  window.dataLayer?.push({ event: "consent_update", analytics_consent: value.analytics, marketing_consent: value.marketing });
  const id = process.env.NEXT_PUBLIC_GTM_ID;
  if ((value.analytics || value.marketing) && id && /^GTM-[A-Z0-9]+$/.test(id) && !document.getElementById("insync-gtm")) {
    window.dataLayer?.push({ "gtm.start": Date.now(), event: "gtm.js" });
    const script = document.createElement("script"); script.id = "insync-gtm"; script.async = true;
    script.src = "https://www.googletagmanager.com/gtm.js?id=" + id; document.head.appendChild(script);
  }
  captureAttribution();
}
export function PrivacyControls() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!initialized) {
      command("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      initialized = true;
    }
    const consent = getConsent();
    queueMicrotask(() => {
      setAnalytics(consent.analytics); setMarketing(consent.marketing);
      try { setVisible(!localStorage.getItem(consentKey)); } catch { setVisible(true); }
    });
    applyConsent(consent);
    const clicks = (event: MouseEvent) => {
      const a = (event.target as Element)?.closest("a"); if (!a) return;
      const href = a.getAttribute("href") || "";
      const name = href.startsWith("tel:") ? "click_phone" : href.includes("wa.me/") ? "click_whatsapp" : "cta_click";
      trackEvent(name, { link_type: name === "cta_click" ? (href.startsWith("#") ? "anchor" : "navigation") : name });
    };
    document.addEventListener("click", clicks);
    return () => document.removeEventListener("click", clicks);
  }, []);
  useEffect(() => { captureAttribution(); trackEvent("page_view", { page_path: pathname }); }, [pathname]);
  function save(value: Consent) {
    const previous = getConsent();
    try { localStorage.setItem(consentKey, JSON.stringify(value)); } catch {}
    setAnalytics(value.analytics); setMarketing(value.marketing); applyConsent(value);
    if ((!previous.analytics && value.analytics) || (!previous.marketing && value.marketing)) trackEvent("page_view", { page_path: location.pathname });
    setVisible(false); dialog.current?.close();
    // Unload tags when consent is withdrawn; GTM must also enforce consent on every tag.
    if ((previous.analytics && !value.analytics) || (previous.marketing && !value.marketing)) location.reload();
  }
  const button = "min-h-11 rounded border border-[#122552]/25 px-4 py-2 text-sm";
  return <>
    {visible && <section aria-label="Cookie preferences" className="fixed inset-x-4 bottom-24 z-[70] mx-auto max-w-2xl rounded-lg border border-[#122552]/15 bg-white p-5 text-[#182C49] shadow-xl md:bottom-6">
      <p className="font-semibold">Your privacy choices</p><p className="mt-2 text-sm leading-6">We use essential security tools for enquiries. Optional analytics and advertising help us understand visits. You choose what to allow.</p>
      <div className="mt-4 flex flex-wrap gap-2"><button className={button} onClick={() => save({ analytics: true, marketing: true })}>Accept all</button><button className={button} onClick={() => save({ analytics: false, marketing: false })}>Reject</button><button className={button} onClick={() => dialog.current?.showModal()}>Manage preferences</button></div>
    </section>}
    <button className="block w-full bg-[#EAF0F7] px-6 py-4 text-sm text-[#236A9E] underline" onClick={() => dialog.current?.showModal()}>Privacy preferences</button>
    <dialog ref={dialog} className="m-auto w-[min(92vw,480px)] rounded-lg bg-white p-6 text-[#182C49] backdrop:bg-[#122552]/65" aria-labelledby="privacy-title">
      <h2 id="privacy-title" className="font-display text-3xl">Privacy preferences</h2>
      <p className="my-4 text-sm leading-6">Essential security is always enabled. Optional choices can be changed at any time.</p>
      <label className="flex min-h-12 items-center gap-3"><input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)}/>Analytics</label>
      <label className="flex min-h-12 items-center gap-3"><input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)}/>Advertising</label>
      <div className="mt-4 flex flex-wrap gap-2"><button className={button} onClick={() => save({ analytics, marketing })}>Save preferences</button><button className={button} onClick={() => dialog.current?.close()}>Close</button></div>
    </dialog>
  </>;
}
