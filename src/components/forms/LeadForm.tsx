"use client";

import { useEffect, useState, useRef, useId, cloneElement, isValidElement } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import type { FormValues } from "@/lib/lead-schema";
import { getConsent, readAttribution } from "@/lib/privacy";
import { Turnstile } from "./Turnstile";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Values = FormValues;
const validateForm: import("react-hook-form").Resolver<Values> = async (values, context, options) => {
  const [{ zodResolver }, { formSchema }] = await Promise.all([import("@hookform/resolvers/zod"), import("@/lib/lead-schema")]);
  return zodResolver(formSchema)(values, context, options);
};
const budgetOptions = ["Under ₹25 lakh", "₹25 lakh – under ₹40 lakh", "₹40 lakh – under ₹60 lakh", "₹60 lakh – under ₹80 lakh", "₹80 lakh – ₹1 crore", "Above ₹1 crore", "Not decided yet"];
const plotSizeRanges = ["Under 1,500 sq. ft.", "1,500–2,000 sq. ft.", "2,000–3,000 sq. ft.", "Above 3,000 sq. ft."];

export function LeadForm({ project, plotSizes = [], mode = "general", dark = false, defaultBuyerType = "", className }: { project?: string; plotSizes?: string[]; mode?: "general" | "project" | "contact"; dark?: boolean; defaultBuyerType?: string; className?: string }) {
  const [state, setState] = useState<"idle" | "success" | "error">("idle");
  const started = useRef(false);
  const statusRef = useRef<HTMLDivElement>(null);
  const requestId = useRef("");
  const [formToken, setFormToken] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [revision, setRevision] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<Values>({ resolver: validateForm, defaultValues: { fullName: "", phone: "", email: "", buyerType: defaultBuyerType, budget: "", plotSize: "", preferredVisitDate: "", message: "", website: "" } });
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) return;
    let active = true;
    fetch("/api/leads", { cache: "no-store" }).then(r => r.json()).then(data => { if (active) setFormToken(data.formToken || ""); }).catch(() => {});
    requestId.current = crypto.randomUUID();
    return () => { active = false; };
  }, []);
  useEffect(() => { if (state === "success") statusRef.current?.focus(); }, [state]);
  useEffect(() => { trackEvent("lead_form_view", { project: project || "General" }); }, [project]);
  async function onSubmit(values: Values) {
    setState("idle"); trackEvent("lead_submit", { project: project || "General" });
    if (!turnstileToken || !formToken) { setErrorMessage("Please complete verification, or refresh the page and try again."); setState("error"); return; }
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, project: project || "", sourcePage: location.origin + location.pathname, referrer: document.referrer ? new URL(document.referrer).origin : "", ...readAttribution(), consent: true, marketingConsent: getConsent().marketing, turnstileToken, formToken, requestId: requestId.current }), signal: AbortSignal.timeout(45000) });
      const result = await response.json();
      if (!response.ok || !result.ok || !result.leadId) throw new Error(result.message || "Unable to send your enquiry. Please try again.");
      setState("success");
      if (!result.duplicate) trackEvent("generate_lead", { project: project || "General", event_id: result.leadId });
    } catch (error) { setErrorMessage(error instanceof Error && error.name !== "TimeoutError" ? error.message : "Your enquiry could not be confirmed. Please try again shortly."); setState("error"); trackEvent("lead_error", { project: project || "General" }); }
    finally { setTurnstileToken(""); setRevision(value => value + 1); }
  }
  if (state === "success") return <div ref={statusRef} tabIndex={-1} className={cn("lead-form flex min-h-80 flex-col items-start justify-center", className)} role="status"><CheckCircle2 size={40} className="mb-6 text-[#3084C2]"/><h3 className="font-display text-4xl">Thank you.</h3><p className={cn("mt-3 max-w-md leading-7", dark ? "text-white/65" : "text-[#52647B]")}>We’ve received your enquiry. Our team can now review what you’re looking for.</p><button className="mt-6 text-xs font-bold uppercase tracking-normal text-[#3084C2]" onClick={() => { setState("idle"); reset(); started.current = false; requestId.current = crypto.randomUUID(); }}>Send another enquiry</button></div>;
  const field = "field";
  return <form className={cn("lead-form grid min-w-0 gap-x-8 gap-y-5 sm:grid-cols-2", className)} onSubmit={event => { void handleSubmit(onSubmit, () => trackEvent("form_validation_error", { project: project || "General" }))(event); }} onFocus={() => { if (!started.current) { started.current = true; trackEvent("lead_form_start", { project: project || "General" }); } }} noValidate aria-busy={isSubmitting}>
    <div className="sm:col-span-2"><Field label="Full Name *" error={errors.fullName?.message}><input className={field} placeholder="Your name" autoComplete="name" {...register("fullName")}/></Field></div>
    <Field label="Mobile Number *" error={errors.phone?.message}><input className={field} type="tel" placeholder="+91" inputMode="tel" autoComplete="tel" {...register("phone")}/></Field>
    <Field label="Email" error={errors.email?.message}><input className={field} placeholder="you@example.com" type="email" autoComplete="email" {...register("email")}/></Field>
    {mode === "project" ? <Field label="Preferred Plot Size"><select className={field} {...register("plotSize")}><option value="">Select preferred plot size</option>{(plotSizes.length ? plotSizes : plotSizeRanges).map(size => <option key={size} value={size}>{size}</option>)}<option value="Not decided yet">Not decided yet</option></select></Field> : <Field label={mode === "contact" ? "Interest" : "Buyer Type"}><select className={field} {...register("buyerType")}><option value="">Select one</option><option>A Place to Build Your Home</option><option>A Long-Term Investment</option><option>Commercial Opportunity</option><option>General Enquiry</option></select></Field>}
    <Field label="Preferred Budget"><select className={field} {...register("budget")}><option value="">Select your budget range</option>{budgetOptions.map(budget => <option key={budget} value={budget}>{budget}</option>)}</select></Field>
    {mode === "project" && <Field label="Preferred Visit Date"><input className={field} type="date" min={new Date().toISOString().split("T")[0]} {...register("preferredVisitDate")}/></Field>}
    <div className="sm:col-span-2"><Field label="Message"><textarea className={`${field} min-h-24 resize-y`} placeholder="How can we help?" {...register("message")}/></Field></div>
    <div className="sm:col-span-2"><Turnstile onToken={setTurnstileToken} revision={revision}/></div>
    <input aria-label="Leave this field empty" tabIndex={-1} autoComplete="off" className="absolute left-[-9999px]" aria-hidden="true" {...register("website")}/>
    <div className="sm:col-span-2"><p className={cn("mb-5 max-w-2xl text-[.7rem] leading-5", dark ? "text-white/45" : "text-[#52647B]")}>By submitting, you consent to Insync Realty contacting you about this enquiry. Please review our <Link prefetch={false} href="/privacy-policy" className="underline">Privacy Policy</Link>.</p><Button type="submit" variant={dark ? "secondary" : "dark"} disabled={isSubmitting}>{isSubmitting ? "Sending…" : mode === "project" ? "Get Project Details" : "Request a Callback"}</Button>{state === "error" && <p className="mt-4 text-sm text-red-600" role="alert">{errorMessage}</p>}</div>
  </form>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  const id = useId();
  const control = isValidElement<Record<string, unknown>>(children) ? cloneElement(children, { id, "aria-invalid": !!error, "aria-describedby": error ? id + "-error" : undefined, "aria-required": label.endsWith("*") }) : children;
  return <div className="min-w-0 text-[.68rem] font-bold tracking-normal"><label htmlFor={id} className="block uppercase">{label}</label>{control}{error && <span id={id + "-error"} className="error-text block" role="alert">{error}</span>}</div>;
}
