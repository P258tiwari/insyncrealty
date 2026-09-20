import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, publishedProjects } from "@/content/projects";
import { ProjectExperience } from "@/components/projects/ProjectExperience";

export function generateStaticParams() { return publishedProjects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const project = getProject((await params).slug); if (!project) return {}; return { title: { absolute: project.seo.title }, description: project.seo.description, alternates: { canonical: `/projects/${project.slug}` }, openGraph: { title: project.seo.title, description: project.seo.description, images: project.heroImage ? [project.heroImage] : undefined } }; }
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) { const project = getProject((await params).slug); if (!project) notFound(); const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: project.faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }; return <><ProjectExperience project={project}/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}/></>; }
