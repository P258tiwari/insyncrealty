import { z } from "zod";
const text = (max: number) => z.string().trim().max(max).refine(value => !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value), "Please use plain text.");
const optional = (max: number) => text(max).default("");
export const normalizePhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  const local = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits.length === 11 && digits.startsWith("0") ? digits.slice(1) : digits;
  return /^[6-9]\d{9}$/.test(local) ? "+91" + local : "";
};
export const formSchema = z.object({
  fullName: text(100).min(2, "Please enter your full name."),
  phone: text(24).refine(v => /^[+\d\s()-]+$/.test(v) && !!normalizePhone(v), "Enter a valid 10-digit Indian mobile number."),
  email: text(254).email("Please enter a valid email.").or(z.literal("")),
  buyerType: text(100), budget: text(100), plotSize: text(100),
  preferredVisitDate: text(10).refine(v => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), "Choose a valid date."),
  message: text(1500), website: text(100),
});
export type FormValues = z.infer<typeof formSchema>;
const pageUrl = z.string().max(2048).url().refine(v => ["http:", "https:"].includes(new URL(v).protocol));
export const leadSchema = formSchema.extend({
  project: optional(100), city: optional(100),
  sourcePage: pageUrl, referrer: pageUrl.or(z.literal("")).default(""),
  utmSource: optional(150), utmMedium: optional(150), utmCampaign: optional(150), utmTerm: optional(150), utmContent: optional(150),
  gclid: optional(250), fbclid: optional(250),
  consent: z.literal(true), marketingConsent: z.boolean().default(false),
  turnstileToken: z.string().min(1).max(2048),
  formToken: z.string().min(1).max(300), requestId: z.string().uuid(),
}).strict().transform(v => ({ ...v, phone: normalizePhone(v.phone), email: v.email.toLowerCase() }));
export type LeadInput = z.infer<typeof leadSchema>;
