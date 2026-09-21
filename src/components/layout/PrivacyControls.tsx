"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ShieldCheck, SlidersHorizontal, X } from "lucide-react";
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
  const button = "min-h-11 rounded-lg border border-[#122552]/20 bg-[#F7F9FC] px-4 py-2.5 text-sm font-semibold text-[#122552] transition-colors hover:border-[#236A9E] hover:bg-[#EAF0F7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#236A9E]";
  return <>
    {visible && <section aria-label="Cookie preferences" className="fixed inset-x-3 bottom-24 z-[70] max-h-[calc(100svh-7rem)] overflow-y-auto rounded-2xl border border-[#122552]/10 bg-white p-5 text-[#182C49] shadow-[0_12px_48px_rgba(18,37,82,.16)] sm:inset-x-auto sm:left-6 sm:w-[400px] sm:p-6 md:bottom-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF0F7] text-[#236A9E]"><ShieldCheck size={22} strokeWidth={1.5} aria-hidden="true"/></span>
        <p className="text-lg font-semibold tracking-normal">Your privacy, your choice.</p>
      </div>
      <p className="mt-4 text-sm leading-6 text-[#52647B]">We use essential tools to keep enquiries secure. Choose whether to allow optional analytics and advertising.</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button className={button} onClick={() => save({ analytics: true, marketing: true })}>Accept all</button>
        <button className={button} onClick={() => save({ analytics: false, marketing: false })}>Reject</button>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 border-t border-[#122552]/10 pt-2">
        <button className="inline-flex min-h-11 items-center gap-2 rounded text-xs font-semibold text-[#236A9E] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2" onClick={() => dialog.current?.showModal()}><SlidersHorizontal size={14} aria-hidden="true"/>Manage preferences</button>
        <a href="/privacy-policy" className="inline-flex min-h-11 items-center text-xs text-[#52647B] underline underline-offset-4">Privacy policy</a>
      </div>
    </section>}
    <button className="block w-full bg-[#EAF0F7] px-6 py-4 text-sm text-[#236A9E] underline" onClick={() => dialog.current?.showModal()}>Privacy preferences</button>
    <dialog ref={dialog} className="m-auto max-h-[85svh] w-[min(92vw,480px)] overflow-y-auto rounded-2xl border border-[#122552]/10 bg-white p-6 text-[#182C49] shadow-2xl backdrop:bg-[#122552]/65 sm:p-8" aria-labelledby="privacy-title">
      <div className="flex items-start justify-between gap-4">
        <div><ShieldCheck className="mb-4 text-[#236A9E]" size={28} strokeWidth={1.5} aria-hidden="true"/><h2 id="privacy-title" className="font-display text-3xl">Privacy preferences</h2></div>
        <button aria-label="Close" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EAF0F7] text-[#122552] hover:bg-[#B8DCFA]" onClick={() => dialog.current?.close()}><X size={18} aria-hidden="true"/></button>
      </div>
      <p className="mb-6 mt-3 text-sm leading-6 text-[#52647B]">Choose what works for you. You can change these settings at any time.</p>
      <div className="divide-y divide-[#122552]/10 rounded-xl border border-[#122552]/10 px-4">
        <div className="flex items-center justify-between gap-4 py-4"><div><p className="text-sm font-semibold">Essential</p><p className="mt-1 text-xs leading-5 text-[#52647B]">Security and enquiry protection.</p></div><span className="shrink-0 rounded-full bg-[#EAF0F7] px-3 py-1 text-[11px] font-semibold text-[#236A9E]">Always on</span></div>
        <label className="flex cursor-pointer items-center justify-between gap-4 py-4"><span><span className="block text-sm font-semibold">Analytics</span><span className="mt-1 block text-xs leading-5 text-[#52647B]">Help us understand how the website is used.</span></span><input aria-label="Analytics" type="checkbox" className="h-5 w-5 shrink-0 accent-[#236A9E]" checked={analytics} onChange={e => setAnalytics(e.target.checked)}/></label>
        <label className="flex cursor-pointer items-center justify-between gap-4 py-4"><span><span className="block text-sm font-semibold">Advertising</span><span className="mt-1 block text-xs leading-5 text-[#52647B]">Help measure and improve our advertising.</span></span><input aria-label="Advertising" type="checkbox" className="h-5 w-5 shrink-0 accent-[#236A9E]" checked={marketing} onChange={e => setMarketing(e.target.checked)}/></label>
      </div>
      <button className="mt-6 min-h-12 w-full rounded-lg bg-[#122552] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#236A9E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#236A9E]" onClick={() => save({ analytics, marketing })}>Save preferences</button>
    </dialog>
  </>;
}