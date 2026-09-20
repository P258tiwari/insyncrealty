import { pageMetadata } from "@/lib/metadata";
import Image from "next/image";
import { ArrowRight, Compass, Sunrise } from "lucide-react";
import { company } from "@/content/company";
import { Button } from "@/components/shared/Button";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

export const metadata = pageMetadata("About", "Learn about Insync Realty’s approach to thoughtful property discovery, clear communication and long-term value.", "/about");
const steps = ["We listen before we recommend.", "We put location and context into perspective.", "We keep project information clear and editable.", "We encourage careful, informed decisions."];

export default function AboutPage() { return <>
  <section className="dark section-pad pt-44"><div className="container-site"><p className="eyebrow mb-8 text-[#3084C2]">About Insync Realty</p><h1 className="display-xl max-w-5xl">A Real-Estate Relationship Built on <span className="text-[#3084C2]">Clarity and Trust.</span></h1><p className="mt-8 max-w-2xl text-lg leading-8 text-white/60">We believe people make better property decisions when the conversation begins with what they genuinely need.</p></div></section>
  <section className="section-pad"><div className="container-site grid items-center gap-14 lg:grid-cols-2"><Reveal><SectionHeading eyebrow="Our Story" title="Property Decisions Deserve More Thought."/><p className="body-lg mt-8">Insync Realty was shaped around a simple idea: real estate should feel understandable. Our role is to help buyers navigate opportunities with greater context, calmer conversations and a focus on lasting relevance.</p><p className="mt-5 text-sm leading-7 text-[#52647B]">As the brand grows across multiple developments, this philosophy remains the common thread.</p></Reveal><div className="relative min-h-[500px]"><Image src="/images/home/property-consultation.webp" alt="A couple discussing a residential site plan with a property advisor" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-center"/></div></div></section>
  <section className="section-pad bg-[#EAF0F7]" aria-labelledby="purpose-heading">
    <div className="container-site grid gap-12 lg:grid-cols-[.85fr_1.3fr] lg:gap-24">
      <div>
        <p className="eyebrow mb-7">Our purpose</p>
        <h2 id="purpose-heading" className="font-display max-w-md text-[clamp(2.5rem,4vw,3.75rem)] font-medium leading-[1.05] tracking-[-.025em]">Guided by clarity.<br/><span className="text-[#236A9E]">Built on trust.</span></h2>
        <p className="mt-6 max-w-sm text-base leading-8 text-[#52647B]">A clear purpose for today. A considered perspective on tomorrow.</p>
        <div className="mt-10 h-px w-20 bg-[#3084C2]" aria-hidden="true"/>
      </div>
      <div className="border-t border-[#122552]/20">
        {[
          { label: "Mission", title: "Clarity at every step.", text: company.mission, icon: Compass },
          { label: "Vision", title: "Value that lasts.", text: company.vision, icon: Sunrise },
        ].map(({ label, title, text, icon: Icon }, index) => <article key={label} className="grid grid-cols-[2.75rem_1fr] gap-5 border-b border-[#122552]/20 py-8 sm:grid-cols-[3.25rem_1fr] sm:gap-7 sm:py-10">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#236A9E]/20 text-[#236A9E] sm:h-13 sm:w-13"><Icon size={23} strokeWidth={1.4} aria-hidden="true"/></div>
          <div><p className="text-[.65rem] font-bold uppercase tracking-[.2em] text-[#236A9E]"><span className="mr-3" aria-hidden="true">0{index + 1}</span>Our {label}</p><h3 className="font-display mt-3 text-3xl font-medium leading-tight text-[#122552] sm:text-4xl">{title}</h3><p className="mt-4 max-w-lg text-base leading-8 text-[#52647B]">{text}</p></div>
        </article>)}
      </div>
    </div>
  </section>
  <section className="section-pad"><div className="container-site"><SectionHeading eyebrow="Our Values" title="Principles That Keep Us In Sync."/><div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4">{company.values.map((value, i) => <div key={value.title} className={`fine-rule p-7 first:pl-0 ${i > 0 ? "border-t" : ""} ${i < 2 ? "md:border-t-0" : "md:border-t"} ${i % 2 === 0 ? "md:border-r" : "md:border-r-0"} lg:border-t-0 ${i < 3 ? "lg:border-r" : "lg:border-r-0"}`}><span className="font-display text-2xl text-[#3084C2]">0{i + 1}</span><h3 className="font-display mt-16 text-3xl">{value.title}</h3><p className="mt-3 text-sm leading-7 text-[#52647B]">{value.text}</p></div>)}</div></div></section>
  <section id="approach" className="brand-panel section-pad"><div className="container-site grid gap-14 lg:grid-cols-[.75fr_1.25fr]"><SectionHeading light eyebrow="How We Work" title="A Considered Path From Question to Decision."/><div className="border-t border-white/15">{steps.map((step, i) => <div key={step} className="grid grid-cols-[50px_1fr_auto] items-center border-b border-white/15 py-6"><span className="font-display text-2xl text-[#3084C2]">0{i + 1}</span><p className="font-display text-2xl">{step}</p><ArrowRight size={16}/></div>)}</div></div></section>
  {company.leadership.length > 0 && <section className="section-pad"><div className="container-site"><SectionHeading eyebrow="Leadership" title="People Behind the Purpose."/>{company.leadership.map((leader) => <div key={leader.name}>{leader.name}</div>)}</div></section>}
  <section className="section-pad"><div className="container-site max-w-4xl text-center"><p className="eyebrow mb-8 justify-center">The future</p><h2 className="display-lg">One Trusted Brand. Thoughtful Developments Ahead.</h2><p className="body-lg mx-auto mt-7 max-w-2xl">Santushti Enclave is the first project presented by Insync Realty. The platform is ready to grow as new, verified opportunities are added.</p><Button href="/projects" variant="dark" className="mt-9">Explore Our Projects</Button></div></section>
  </>; }
