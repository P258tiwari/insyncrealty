"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/shared/Button";
import { cn } from "@/lib/utils";

const nav = [
  ["Home", "/"], ["About", "/about"], ["Projects", "/projects"], ["Why Insync", "/#why-insync"], ["Contact", "/contact"],
] as const;

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open) menu.current?.showModal(); else menu.current?.close();
    const previous = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  const [hash, setHash] = useState("");
  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);
    return () => {
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
    };
  }, [pathname]);
  const isActive = (href: string) => {
    if (href === "/#why-insync") return pathname === "/" && hash === "#why-insync";
    if (href === "/") return pathname === "/" && hash !== "#why-insync";
    return pathname === href || pathname.startsWith(`${href}/`);
  };
  const overlay = pathname === "/" || pathname.startsWith("/projects/");
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 40); onScroll(); addEventListener("scroll", onScroll, { passive: true }); return () => removeEventListener("scroll", onScroll); }, []);
  const light = overlay && !scrolled && !open;
  return <>
    <header className={cn("fixed inset-x-0 top-0 z-50 border-b transition-all duration-500", scrolled || !overlay ? "border-[#122552]/10 bg-[#F7F9FC]/95 py-3 shadow-[0_8px_40px_rgba(18,37,82,.08)] backdrop-blur-md" : "border-white/15 bg-gradient-to-b from-[#0C1D4B]/65 to-transparent py-5")}>
      <div className="container-site flex items-center justify-between gap-8">
        <Logo light={light} />
        <nav aria-label="Primary navigation" className={cn("desktop-only ml-auto flex items-center gap-8 text-[.68rem] font-bold uppercase tracking-[.14em]", light ? "text-white" : "text-[#122552]")}>
          {nav.map(([label, href]) => <Link prefetch={false} key={href} href={href} onClick={() => setHash(href.includes("#") ? "#why-insync" : "")} aria-current={isActive(href) ? (href.includes("#") ? "location" : "page") : undefined} className={cn("relative border-b-2 border-transparent py-3 transition-colors", light ? "hover:!text-[#B8DCFA]" : "hover:!text-[#236A9E]", isActive(href) && "!border-[#3084C2]", isActive(href) && (light ? "!text-[#B8DCFA]" : "!text-[#236A9E]"))}>{label}</Link>)}
        </nav>
        <Button href="/projects" variant={light ? "secondary" : "dark"} className="desktop-only ml-2 min-w-[13rem] shadow-[0_10px_30px_rgba(0,0,0,.18)]">Explore Projects</Button>
        <button onClick={() => setOpen(!open)} className={cn("mobile-only h-12 w-12 items-center justify-center", light ? "text-white" : "text-[#122552]")} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>{open ? <X /> : <Menu />}</button>
      </div>
    </header>
    <dialog ref={menu} onCancel={() => setOpen(false)} aria-label="Navigation menu" className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-[#122552] px-6 pb-10 pt-20 text-white backdrop:bg-[#122552]">
      <button onClick={() => setOpen(false)} aria-label="Close menu" className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center"><X/></button>
      <nav className="flex flex-1 flex-col justify-center" aria-label="Mobile navigation">{nav.map(([label, href], i) => <Link prefetch={false} key={href} href={href} onClick={() => { setOpen(false); setHash(href.includes("#") ? "#why-insync" : ""); }} aria-current={isActive(href) ? (href.includes("#") ? "location" : "page") : undefined} tabIndex={open ? 0 : -1} className={cn("font-display border-b border-white/15 py-4 text-4xl", isActive(href) && "!border-[#3084C2] !text-[#B8DCFA]")} style={{ transitionDelay: `${i * 40}ms` }}>{label}</Link>)}</nav>
      <p className="text-sm text-white/55">Real Value. Real Trust.</p>
    </dialog>
  </>;
}
