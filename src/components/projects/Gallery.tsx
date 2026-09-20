"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

type Item = { src?: string; category: string; alt: string };
export function Gallery({ items }: { items: Item[] }) {
  const [active, setActive] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const isOpen = active !== null;
  const selected = active !== null ? items[active] : undefined;

  useEffect(() => {
    if (!isOpen) return;
    const modal = dialog.current;
    const previousOverflow = document.body.style.overflow;
    modal?.showModal();
    document.body.style.overflow = "hidden";
    return () => { modal?.close(); document.body.style.overflow = previousOverflow; };
  }, [isOpen]);

  const move = (offset: number) => setActive(current => current === null ? null : (current + offset + items.length) % items.length);
  return <>
    <div className="grid auto-rows-[240px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => <button type="button" key={`${item.category}-${i}`} onClick={() => setActive(i)} className={`group relative min-h-0 overflow-hidden bg-[#173966] text-left text-white ${i === 0 || i === 4 ? "sm:row-span-2" : ""}`} aria-label={`Open ${item.category} image`}>
        {item.src ? <Image src={item.src} alt={item.alt} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none"/> : <span className="absolute inset-0 flex items-center justify-center p-6 text-sm">Image coming soon</span>}
        <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"/>
        <span className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4"><span className="text-[.65rem] font-bold uppercase tracking-widest">{item.category}</span><Maximize2 size={17} aria-hidden="true" className="shrink-0"/></span>
      </button>)}
    </div>
    <dialog ref={dialog} aria-label="Project gallery" onCancel={() => setActive(null)} onClick={event => { if (event.target === event.currentTarget) setActive(null); }} onKeyDown={event => { if (event.key === "ArrowRight") { event.preventDefault(); move(1); } if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); } }} className="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none bg-[#0C1D4B]/98 p-0 text-white backdrop:bg-black/70">
      {selected && <>
        <button type="button" onClick={() => setActive(null)} className="absolute right-3 top-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 sm:right-6 sm:top-6" aria-label="Close gallery"><X/></button>
        <figure className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center px-14 py-20 sm:px-20">
          <div className="relative min-h-0 flex-1">{selected.src ? <Image src={selected.src} alt={selected.alt} fill sizes="(max-width: 1280px) 90vw, 1100px" className="object-contain"/> : <p className="pt-20 text-center">Image coming soon</p>}</div>
          <figcaption className="mt-5 text-center"><p className="text-sm font-semibold">{selected.category}</p><p className="mt-2 text-xs text-white/70" aria-live="polite">{(active ?? 0) + 1} / {items.length} · Illustrative visual</p></figcaption>
        </figure>
        <button type="button" onClick={() => move(-1)} className="absolute left-1 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 sm:left-5" aria-label="Previous image"><ChevronLeft/></button>
        <button type="button" onClick={() => move(1)} className="absolute right-1 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 sm:right-5" aria-label="Next image"><ChevronRight/></button>
      </>}
    </dialog>
  </>;
}
