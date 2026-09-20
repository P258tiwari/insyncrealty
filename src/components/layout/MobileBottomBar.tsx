"use client";
import { MessageCircle, Phone, Send } from "lucide-react";
import Link from "next/link";
import { company, whatsappUrl } from "@/content/company";


export function MobileBottomBar() {
  const items = [
    { label: "Call", href: `tel:${company.phoneHref}`, icon: Phone, event: "phone_click" as const },
    { label: "WhatsApp", href: whatsappUrl("Hello Insync Realty, I would like to know more about your projects."), icon: MessageCircle, event: "whatsapp_click" as const },
    { label: "Enquire", href: "/contact#enquiry", icon: Send, event: "lead_form_view" as const },
  ];
  return <div className="fixed inset-x-0 bottom-0 z-50 grid h-[68px] grid-cols-3 border-t border-white/10 bg-[#122552] text-white md:hidden">{items.map(({ label, href, icon: Icon }) => <Link prefetch={false} key={label} href={href}  className="flex flex-col items-center justify-center gap-1 border-r border-white/10 text-[.64rem] font-bold uppercase tracking-wider last:border-0"><Icon size={18}/>{label}</Link>)}</div>;
}
