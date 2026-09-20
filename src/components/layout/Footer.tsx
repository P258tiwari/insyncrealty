import Link from "next/link";
import { ArrowUpRight, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Youtube } from "lucide-react";
import { Logo } from "./Logo";
import { company, whatsappUrl } from "@/content/company";

const columns = [
  { title: "Company", links: [["About", "/about"], ["Why Insync", "/#why-insync"], ["Contact", "/contact"]] },
  { title: "Projects", links: [["Santushti Enclave", "/projects/santushti-enclave"]] },
  { title: "Resources", links: [["Privacy Policy", "/privacy-policy"], ["Terms", "/terms"], ["Disclaimer", "/disclaimer"]] },
];

const socials = [
  { name: "Facebook", href: company.socialLinks.facebook, icon: <Facebook size={19} aria-hidden="true"/> },
  { name: "Instagram", href: company.socialLinks.instagram, icon: <Instagram size={19} aria-hidden="true"/> },
  { name: "YouTube", href: company.socialLinks.youtube, icon: <Youtube size={20} aria-hidden="true"/> },
  { name: "X", href: company.socialLinks.x, icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.64 7.584H.47l8.6-9.835L0 1.154h7.594l5.243 6.932 6.064-6.933ZM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644Z"/></svg> },
];

export function Footer() {
  return <footer className="bg-[#E4EBF3] pb-8 pt-20 text-[#122552]">
    <div className="container-site grid items-start gap-10 border-b border-[#122552]/15 pb-16 lg:grid-cols-[1.2fr_1.65fr_1.25fr]">
      <div><Logo/><p className="font-display mt-7 text-2xl text-[#236A9E]">{company.tagline}</p><p className="mt-5 max-w-xs text-sm leading-7 text-[#52647B]">{company.description}</p><nav aria-label="Social media" className="mt-7 flex flex-wrap gap-3">{socials.map(({ name, href, icon }) => <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Insync Realty on ${name}`} title={name} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#236A9E]/25 !text-[#236A9E] transition-colors hover:bg-[#236A9E] hover:!text-white">{icon}</a>)}</nav></div>
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">{columns.map((column) => <div key={column.title}><h3 className="mb-5 text-[.65rem] font-bold uppercase tracking-[.2em] text-[#236A9E]">{column.title}</h3><ul className="space-y-3 text-sm text-[#425875]">{column.links.map(([label, href]) => <li key={href}><Link prefetch={false} href={href} className="transition-colors hover:text-[#236A9E]">{label}</Link></li>)}</ul></div>)}</div>
      <div className="border-t-2 border-[#3084C2] bg-[#F7F9FC] p-6">
        <p className="text-[.65rem] font-bold uppercase tracking-[.2em] text-[#236A9E]">Connect with us</p>
        <h3 className="font-display mt-3 text-3xl leading-tight">Let’s find your place.</h3>
        <div className="mt-5 divide-y divide-[#122552]/10">
          <a className="group flex items-center gap-3 py-4 transition-colors hover:text-[#236A9E]" href={`tel:${company.phoneHref}`}><Phone aria-hidden="true" size={17} className="shrink-0 text-[#236A9E]"/><span className="min-w-0"><span className="block text-[.6rem] font-bold uppercase tracking-[.15em] text-[#52647B]">Call us</span><span className="mt-1 block text-sm">{company.phone}</span></span></a>
          <a className="group flex items-center gap-3 py-4 transition-colors hover:text-[#236A9E]" href={`mailto:${company.email}`}><Mail aria-hidden="true" size={17} className="shrink-0 text-[#236A9E]"/><span className="min-w-0"><span className="block text-[.6rem] font-bold uppercase tracking-[.15em] text-[#52647B]">Email us</span><span className="mt-1 block break-words text-sm">{company.email}</span></span></a>
          <div className="flex items-start gap-3 py-4"><MapPin aria-hidden="true" size={17} className="mt-0.5 shrink-0 text-[#236A9E]"/><span className="text-sm leading-6 text-[#425875]">{company.officeAddress}</span></div>
        </div>
        <a className="mt-3 flex min-h-12 items-center justify-between gap-3 bg-[#236A9E] px-4 py-3 !text-white transition-colors hover:bg-[#173966]" href={whatsappUrl("Hello Insync Realty, I would like to know more about your projects.")} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" size={18} className="shrink-0"/><span className="text-xs font-semibold">Chat on WhatsApp</span><ArrowUpRight aria-hidden="true" size={16} className="shrink-0"/></a>
      </div>
    </div>
    <div className="container-site flex flex-col gap-3 pt-7 text-[.68rem] text-[#52647B] sm:flex-row sm:justify-between"><div><p>&copy; {new Date().getFullYear()} Insync Realty. All Rights Reserved.</p><p className="mt-2">Design and Maintenance by <a href="https://www.ampwake.com" target="_blank" rel="noopener noreferrer" className="!inline font-semibold underline underline-offset-4 transition-colors hover:text-[#236A9E]">Ampwake Group</a></p></div><p className="max-w-xl sm:text-right">{company.legalDisclaimer}</p></div>
  </footer>;
}
