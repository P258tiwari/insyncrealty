import { pageMetadata } from "@/lib/metadata";
import { publishedProjects } from "@/content/projects";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { SectionHeading } from "@/components/shared/SectionHeading";

export const metadata = pageMetadata("Projects", "Explore Insync Realty developments with attention to location, planning and long-term relevance.", "/projects");
export default function ProjectsPage() { return <><section className="dark section-pad pt-44"><div className="container-site"><p className="eyebrow mb-8 text-[#3084C2]">Our Developments</p><h1 className="display-xl max-w-4xl">Projects Built Around <span className="text-[#3084C2]">Better Futures.</span></h1></div></section><section className="section-pad"><div className="container-site"><SectionHeading eyebrow="Project Philosophy" title="Fewer Listings. More Consideration." intro="Every published development is presented through the same lens: location, planning, documentation, liveability and fit with the buyer’s purpose."/><div className="mt-14 space-y-8">{publishedProjects.map((project) => <ProjectCard project={project} featured key={project.id}/>)}</div></div></section></>; }
