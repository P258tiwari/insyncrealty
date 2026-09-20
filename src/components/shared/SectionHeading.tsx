import { cn } from "@/lib/utils";

export function SectionHeading({ eyebrow, title, intro, align = "left", light = false, className }: { eyebrow?: string; title: React.ReactNode; intro?: string; align?: "left" | "center"; light?: boolean; className?: string }) {
  return <div className={cn(align === "center" && "mx-auto text-center", className)}>
    {eyebrow && <div className={cn("eyebrow mb-7", align === "center" && "justify-center", light && "eyebrow-light")}>{eyebrow}</div>}
    <h2 className="display-lg">{title}</h2>
    {intro && <p className={cn("body-lg mt-7 max-w-2xl", align === "center" && "mx-auto", light && "text-white/65")}>{intro}</p>}
  </div>;
}
