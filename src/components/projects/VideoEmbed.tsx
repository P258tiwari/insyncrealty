"use client";
import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
export function VideoEmbed({ url, title, poster }: { url: string; title: string; poster?: string }) {
  const [playing, setPlaying] = useState(false);
  return <div className="relative aspect-video overflow-hidden bg-[#122552]">
    {playing ? <iframe src={url.replace("www.youtube.com", "www.youtube-nocookie.com")} title={title} referrerPolicy="strict-origin-when-cross-origin" allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="h-full w-full border-0"/> :
      <button onClick={() => setPlaying(true)} aria-label={"Play " + title} className="absolute inset-0 flex w-full flex-col items-center justify-center gap-4 text-white">
        {poster && <Image src={poster} alt="" fill sizes="(max-width: 768px) 100vw, 1240px" className="object-cover opacity-50"/>}
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white bg-[#122552]/70"><Play aria-hidden="true"/></span>
        <span className="relative px-4 text-sm">Watch the project video · Loads YouTube</span>
      </button>}
  </div>;
}
