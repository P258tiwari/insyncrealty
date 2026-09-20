import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectSlider } from "@/components/projects/ProjectSlider";
import { LeadForm } from "@/components/forms/LeadForm";
import { ScrollStory, DecisionEducation, BuyerIntent } from "@/components/home/InteractiveSections";
import { company } from "@/content/company";
import { featuredProjects } from "@/content/projects";
import { testimonials } from "@/content/testimonials";

const pillars = [
  ["Real Value", "Properties considered with long-term potential in mind."], ["Real Trust", "Clear communication throughout the property journey."], ["Thoughtful Locations", "Connectivity, lifestyle and future context matter."], ["People First", "Recommendations centred around actual buyer requirements."],
];
const reasons = [
  ["Transparent Approach", "Clear conversations and accessible property information."], ["Curated Developments", "A considered selection instead of overwhelming inventory."], ["Location Intelligence", "Attention to access, context and future planning."], ["Customer-Centric Guidance", "Your purpose and priorities shape the conversation."], ["Documentation Focus", "Details and documents are treated with due importance."], ["Long-Term Thinking", "Decisions considered beyond the immediate transaction."],
];
const journey = ["Understand Your Requirement", "Discover the Right Project", "Visit & Explore", "Understand Property Details", "Make an Informed Decision", "Continued Assistance"];

export default function Home() {
  const metrics = Object.entries(company.metrics).filter(([, value]) => value !== null);
  return <>
    <section className="relative flex min-h-[96svh] items-end overflow-hidden bg-[#122552] text-white"><Image src="/images/home/insync-hero.webp" alt="A family walking through a thoughtfully landscaped residential setting" fill loading="eager" fetchPriority="high" sizes="100vw" className="object-cover object-[65%_center] motion-safe:animate-[heroZoom_18s_ease-out_forwards]"/><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,29,75,.92)_0%,rgba(12,29,75,.58)_43%,rgba(12,29,75,.12)_78%),linear-gradient(0deg,rgba(12,29,75,.75),transparent_50%)]"/><div className="container-site relative z-10 pb-16 pt-40 sm:pb-24"><div className="max-w-4xl"><p className="mb-8 text-[.7rem] font-bold uppercase tracking-[.3em] text-[#B8DCFA]">{company.tagline}</p><h1 className="display-xl max-w-3xl">Real Estate, Built Around <em className="font-normal text-[#B8DCFA]">What Truly Matters.</em></h1><p className="mt-8 max-w-xl text-base leading-8 text-white/72 sm:text-lg">{company.description}</p><div className="mt-9 flex flex-wrap gap-3"><Button href="/projects" variant="secondary">Explore Our Projects</Button><Button href="/about" variant="outline">Know Insync Realty</Button></div></div><Link prefetch={false} href="#introduction" aria-label="Scroll to introduction" className="absolute bottom-8 right-5 hidden items-center gap-3 text-[.62rem] font-bold uppercase tracking-widest text-white/55 sm:flex"><ArrowDown size={16}/> Scroll to discover</Link></div></section>

    <section id="introduction" className="section-pad"><div className="container-site grid items-center gap-14 lg:grid-cols-2"><Reveal><p className="eyebrow mb-7">Insync Realty</p><h2 className="display-lg">More Than Real Estate. <span className="text-[#236A9E]">A Relationship Built on Trust.</span></h2><p className="body-lg mt-8 max-w-xl">We help people discover thoughtful property opportunities with focus on clarity, transparency, location, future context and what genuinely matters to the buyer.</p><Button href="/about" variant="text-link" className="mt-7">Our Story</Button></Reveal><Reveal delay={.1} className="relative min-h-[520px] overflow-hidden"><Image src="/images/home/landscaped-development-road.webp" alt="Landscaped internal road with green open spaces in a planned development" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-[58%_center]"/><div className="absolute bottom-0 left-0 max-w-xs bg-[#F7F9FC]/95 p-7 shadow-[0_14px_40px_rgba(18,37,82,.12)] backdrop-blur-sm"><p className="font-display text-2xl">Clarity before commitment.</p><p className="mt-2 text-xs leading-6 text-[#52647B]">A calmer way to explore property.</p></div></Reveal></div></section>

    <section className="section-pad"><div className="container-site"><SectionHeading eyebrow="Our philosophy" title="What Guides Every Property We Present."/><div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4">{pillars.map(([title, text], i) => <Reveal key={title} delay={i * .06} className={`fine-rule p-7 first:pl-0 ${i > 0 ? "border-t" : ""} ${i < 2 ? "md:border-t-0" : "md:border-t"} ${i % 2 === 0 ? "md:border-r" : "md:border-r-0"} lg:border-t-0 ${i < 3 ? "lg:border-r" : "lg:border-r-0"}`}><span className="font-display text-2xl text-[#3084C2]">0{i + 1}</span><h3 className="font-display mt-16 text-3xl">{title}</h3><p className="mt-4 text-sm leading-7 text-[#52647B]">{text}</p></Reveal>)}</div></div></section>

    <section className="relative min-h-[78vh] overflow-hidden dark"><Image src="/images/home/future-neighbourhood.webp" alt="A family walking home through a landscaped neighbourhood at sunset" fill sizes="100vw" className="object-cover object-center opacity-45"/><div className="absolute inset-0 bg-[#122552]/45"/><div className="container-site relative z-10 flex min-h-[78vh] flex-col justify-end py-20"><Reveal><h2 className="display-lg max-w-4xl">Some People Buy Land. <span className="text-[#B8DCFA]">Others Build a Future on It.</span></h2><p className="mt-7 max-w-xl text-lg leading-8 text-white/65">At Insync Realty, we believe real estate should make sense today and continue creating value tomorrow.</p><Button href="/about#approach" variant="outline" className="mt-8">Discover Our Approach</Button></Reveal></div></section>

    <ScrollStory/>

    {metrics.length > 0 && <section className="py-16"><div className="container-site grid grid-cols-2 gap-10 lg:grid-cols-4">{metrics.map(([label, value]) => <div key={label}><p className="font-display text-5xl">{value}</p><p className="mt-2 text-xs uppercase tracking-widest text-[#52647B]">{label}</p></div>)}</div></section>}

    <section id="why-insync" className="section-pad"><div className="container-site"><SectionHeading eyebrow="Why Insync Realty" title="Why Buyers Choose Insync." intro="A considered property journey should give you room to understand, compare and decide with confidence."/><div className="mt-16 grid gap-x-12 md:grid-cols-2 lg:grid-cols-3">{reasons.map(([title, text], i) => <Reveal key={title} delay={(i % 3) * .05} className="group border-t fine-rule py-8"><div className="flex items-start justify-between"><span className="font-display text-3xl text-[#3084C2]">{String(i + 1).padStart(2, "0")}</span><ArrowRight size={17} className="opacity-30 transition-transform group-hover:translate-x-1"/></div><h3 className="font-display mt-14 text-3xl">{title}</h3><p className="mt-3 text-sm leading-7 text-[#52647B]">{text}</p></Reveal>)}</div></div></section>

    <section className="dark relative overflow-hidden section-pad"><Image src="/images/home/belief-landscape.webp" alt="" fill sizes="100vw" className="object-cover object-[65%_center]"/><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,29,75,.72),rgba(12,29,75,.48)_60%,rgba(12,29,75,.18))]"/><div className="container-site relative z-10"><p className="eyebrow mb-8 text-[#3084C2]">Our Belief</p><h2 className="display-lg max-w-4xl">The Right Property<br/>Should Feel Right Today<br/><span className="text-[#3084C2]">and Make Sense Tomorrow.</span></h2></div></section>

    <section id="featured-projects" className="section-pad bg-[#EAF0F7]"><div className="container-site"><SectionHeading eyebrow="Featured Developments" title={<>Places Designed for<br/>Better Tomorrows.</>}/><div className="mt-14"><ProjectSlider projects={featuredProjects}/></div></div></section>

    <DecisionEducation/>

    <section className="section-pad"><div className="container-site grid gap-16 lg:grid-cols-[.72fr_1.28fr]"><SectionHeading eyebrow="The Insync Journey" title="From Discovery to Decision." intro="A clear, human process that keeps your requirements at the centre."/><ol className="border-t fine-rule">{journey.map((step, i) => <li key={step} className="grid grid-cols-[55px_1fr] gap-4 border-b fine-rule py-6"><span className="font-display text-2xl text-[#3084C2]">{String(i + 1).padStart(2, "0")}</span><div><h3 className="font-display text-2xl">{step}</h3>{i === 3 && <p className="mt-2 text-xs leading-6 text-[#52647B]">We help surface relevant information; independent professional verification is always encouraged.</p>}</div></li>)}</ol></div></section>

    <section className="brand-panel section-pad relative overflow-hidden"><Image src="/images/home/garden-terrace.webp" alt="" fill sizes="100vw" className="object-cover object-[65%_center]"/><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,29,75,.88),rgba(12,29,75,.65))]"/><div className="container-site relative z-10 grid items-end gap-10 lg:grid-cols-[1.2fr_.8fr]"><h2 className="font-display text-[clamp(2.25rem,4vw,4rem)] font-medium leading-[1.05] tracking-[-.035em]">Real Estate Is Ultimately<br/>About How You Want to Live.</h2><div><p className="text-lg leading-8 text-white/80">Space for the home you’ve imagined, the moments that become memories and an asset that remains part of your future.</p><Button href="/projects" variant="secondary" className="mt-8">Find Your Place</Button></div></div></section>

    <BuyerIntent/>


    {testimonials.length > 0 && <section className="section-pad"><div className="container-site"><SectionHeading eyebrow="Buyer stories" title="Experiences Shared With Us."/>{testimonials.map((item) => <blockquote key={item.name} className="mt-10"><p>{item.quote}</p><cite>{item.name}</cite></blockquote>)}</div></section>}

    <section id="enquire" className="dark section-pad"><div className="container-site grid gap-14 lg:grid-cols-[.8fr_1.2fr]"><SectionHeading light eyebrow="Let’s Talk" title={<>Your Next Property<br/>Could Start With a Conversation.</>} intro="Tell us what you’re looking for and our team will help you explore the right opportunity."/><LeadForm dark/></div></section>
  </>;
}
