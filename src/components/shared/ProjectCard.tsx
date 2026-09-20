import Image from "next/image";
import type { Project } from "@/types/content";
import { Button } from "./Button";

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  if (!featured) return <article className="group overflow-hidden bg-white">
    <div className="relative aspect-[4/3] overflow-hidden"><Image src={project.thumbnail || "/images/placeholders/editorial.svg"} alt={`${project.name}, ${project.location}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-1000 group-hover:scale-[1.025]"/></div>
    <div className="p-8"><p className="eyebrow mb-5">{project.location}</p><h3 className="font-display text-4xl leading-none">{project.name}</h3><p className="mt-4 text-sm text-[#52647B]">{project.tagline}</p><Button href={`/projects/${project.slug}`} variant="text-link" className="mt-6 self-start">Explore Project</Button></div>
  </article>;

  const approval = project.facts.find((fact) => fact.label === "Approval")?.value || "Government Approved";
  const details = [
    { label: "Approval", value: approval },
    { label: "Format", value: project.type },
    { label: "Status", value: project.status },
  ];

  return <article className="group grid min-w-0 overflow-hidden bg-[#122552] text-white md:grid-cols-[1.08fr_.92fr]">
    <div className="relative min-h-[390px] overflow-hidden md:min-h-[560px]">
      <Image src={project.featuredImage || project.heroImage || project.thumbnail || "/images/placeholders/editorial.svg"} alt={`${project.name} featured development, ${project.location}`} fill sizes="(max-width: 767px) 100vw, 55vw" className="object-cover object-center transition-transform duration-[1400ms] group-hover:scale-[1.025]"/>
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(12,29,75,.76)_0%,rgba(12,29,75,.08)_55%,rgba(12,29,75,.16)_100%)]"/>
      <div className="absolute left-6 top-6 border border-white/25 bg-[#173966]/70 px-4 py-3 text-[.58rem] font-bold uppercase tracking-[.2em] backdrop-blur-sm sm:left-8 sm:top-8">Featured Development</div>
      <div className="absolute inset-x-6 bottom-6 flex items-end justify-between border-t border-white/30 pt-5 sm:inset-x-8 sm:bottom-8">
        <div><p className="text-[.58rem] font-bold uppercase tracking-[.2em] text-[#B8DCFA]">Project Scale</p><p className="font-display mt-1 text-3xl">19 Acres</p></div>
        <p className="font-display text-6xl leading-none text-white/20">01</p>
      </div>
    </div>
    <div className="flex min-w-0 flex-col justify-between p-7 sm:p-10 lg:p-12 xl:p-14">
      <div>
        <p className="eyebrow eyebrow-light mb-7">{project.location}</p>
        <h3 className="font-display text-[clamp(3.2rem,5vw,4.7rem)] leading-[.88] tracking-[-.035em]">{project.name}</h3>
        <p className="mt-6 max-w-md text-sm font-semibold uppercase leading-6 tracking-[.16em] text-white/52">{project.tagline}</p>
        <p className="mt-7 max-w-md text-sm leading-7 text-white/58">{project.overview}</p>
      </div>
      <div className="mt-10">
        <dl className="grid border-y border-white/15 sm:grid-cols-3 md:grid-cols-1 xl:grid-cols-3">{details.map((detail) => <div key={detail.label} className="border-b border-white/15 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:px-4 sm:first:pl-0 sm:last:border-r-0 md:border-b md:border-r-0 md:px-0 xl:border-b-0 xl:border-r xl:px-4 xl:first:pl-0"><dt className="text-[.54rem] font-bold uppercase tracking-[.18em] text-[#3084C2]">{detail.label}</dt><dd className="mt-2 text-xs leading-5 text-white/75">{detail.value}</dd></div>)}</dl>
        <Button href={`/projects/${project.slug}`} variant="secondary" className="mt-8 w-full sm:w-auto">Explore {project.name}</Button>
      </div>
    </div>
  </article>;
}
