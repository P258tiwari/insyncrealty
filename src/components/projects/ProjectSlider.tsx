"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Project } from "@/types/content";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { trackEvent } from "@/lib/analytics";

export function ProjectSlider({ projects }: { projects: Project[] }) {
  const rail = useRef<HTMLDivElement>(null);
  useEffect(() => { projects.forEach((project) => trackEvent("project_view", { project: project.name, placement: "homepage" })); }, [projects]);
  if (projects.length === 1) return <ProjectCard project={projects[0]} featured/>;
  const move = (direction: number) => rail.current?.scrollBy({ left: rail.current.clientWidth * direction, behavior: "smooth" });
  return <div><div ref={rail} className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{projects.map((project) => <div key={project.id} className="w-full shrink-0 snap-start"><ProjectCard project={project} featured/></div>)}</div><div className="mt-6 flex justify-end gap-2"><button onClick={() => move(-1)} className="flex h-12 w-12 items-center justify-center border border-[#122552]/20" aria-label="Previous project"><ArrowLeft size={18}/></button><button onClick={() => move(1)} className="flex h-12 w-12 items-center justify-center border border-[#122552]/20" aria-label="Next project"><ArrowRight size={18}/></button></div></div>;
}
