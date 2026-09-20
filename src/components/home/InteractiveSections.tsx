"use client";
import { useState } from "react";

import { ArrowRight, FileCheck2, MapPin, PenTool, TrendingUp } from "lucide-react";
import Link from "next/link";

const story = ["A Home.", "An Investment.", "A Community.", "A Future.", "Insync Realty."];
export function ScrollStory() {

  return <section className="brand-panel grain overflow-hidden py-24 lg:py-36"><div className="container-site"><p className="eyebrow mb-14 text-[#3084C2]">What property can become</p><div className="space-y-4">{story.map((line, i) => <p key={line} className={`font-display text-[clamp(3.6rem,8vw,8rem)] leading-[1.12] tracking-[-.04em] ${i === story.length - 1 ? "text-[#3084C2]" : ""}`}>{line}</p>)}</div></div></section>;
}

const topics = [
  { title: "Location", icon: MapPin, text: "Look beyond distance. Everyday access, surrounding uses, liveability and the wider planning context all shape a location." },
  { title: "Planning", icon: PenTool, text: "Road hierarchy, plot orientation, open spaces and infrastructure determine how a development may feel and function over time." },
  { title: "Documentation", icon: FileCheck2, text: "Approvals, title, sanctioned plans and written terms deserve careful, independent verification before any decision." },
  { title: "Future Potential", icon: TrendingUp, text: "Consider real demand, established connectivity and credible development—not promises of guaranteed appreciation." },
];
export function DecisionEducation() {

  const [active, setActive] = useState(0);
  const item = topics[active]; const Icon = item.icon;
  return <section className="section-pad bg-[#EAF0F7]"><div className="container-site grid items-stretch gap-14 lg:grid-cols-[.8fr_1.2fr]"><div className="flex flex-col"><p className="eyebrow mb-7">Buyer perspective</p><h2 className="display-lg">A Property Is More Than Its Price.</h2><div className="mt-12 border-t fine-rule lg:mt-auto">{topics.map((topic, i) => <button key={topic.title} className={`flex min-h-16 w-full items-center justify-between border-b fine-rule py-4 text-left transition-colors ${active === i ? "text-[#236A9E]" : "text-[#52647B]"}`} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}><span className="font-display text-2xl">{topic.title}</span><ArrowRight size={17}/></button>)}</div></div><div className="relative flex min-h-[420px] flex-col overflow-hidden bg-[#122552] p-9 text-white sm:p-16 lg:h-full lg:min-h-0"><div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-[#3084C2]/25"/><Icon size={44} strokeWidth={1} className="relative z-10 shrink-0 text-[#3084C2]"/><div key={active} className="relative z-10 mt-auto pt-20"><p className="font-display text-5xl">{item.title}</p><p className="mt-5 max-w-lg text-base leading-8 text-white/65">{item.text}</p></div></div></div></section>;
}

export function BuyerIntent() {
  const options = ["A Place to Build Your Home", "A Long-Term Investment", "Commercial Opportunity"];
  return <section className="section-pad"><div className="container-site"><p className="eyebrow mb-7">Start with your purpose</p><h2 className="display-lg mb-12">What Are You Looking For?</h2><div className="border-t fine-rule">{options.map((option, i) => <Link prefetch={false} href={`/contact?buyerType=${encodeURIComponent(option)}#enquiry`} key={option} className="group grid min-h-28 grid-cols-[50px_1fr_auto] items-center gap-4 border-b fine-rule py-5"><span className="font-display text-2xl text-[#3084C2]">0{i + 1}</span><span className="font-display text-2xl transition-transform group-hover:translate-x-2 sm:text-4xl">{option}</span><ArrowRight className="transition-transform group-hover:translate-x-1"/></Link>)}</div></div></section>;
}
