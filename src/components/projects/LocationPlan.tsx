import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Button } from "@/components/shared/Button";

export function LocationPlan({ name, location, image, directionsUrl }: {
  name: string;
  location: string;
  image: { src: string; width: number; height: number; alt: string };
  directionsUrl?: string;
}) {
  const embed = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL;
  return (
    <section id="location-plan" aria-labelledby="location-heading" className="section-pad bg-[#EAF0F7]">
      <div className="container-site">
        <div className="grid items-center gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="eyebrow text-[#236A9E]">Location &amp; Directions</p>
            <h2 id="location-heading" className="font-display mt-6 text-4xl leading-[1.15] text-[#122552] sm:text-5xl lg:text-6xl">Plan Your Visit<br className="hidden sm:block"/> to {name}.</h2>
            <p className="mt-6 max-w-md text-base leading-8 text-[#52647B]">Explore the neighbourhood, find your route and come see the possibilities for yourself.</p>
            <div className="mt-8 border-y border-[#122552]/15 py-6">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#236A9E]"><MapPin size={24} strokeWidth={1.5} aria-hidden="true"/></span>
                <div><p className="text-sm font-semibold text-[#122552]">{name}</p><p className="mt-1 text-sm text-[#52647B]">{location}</p></div>
              </div>
              <p className="mt-5 max-w-md text-sm leading-7 text-[#52647B]">Use the location plan to explore nearby landmarks, or open Google Maps for directions to the site.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {directionsUrl && <Button href={directionsUrl} target="_blank">Get Directions</Button>}
                <Button href="#project-enquiry" variant="text-link">Arrange a Visit</Button>
              </div>
            </div>
          </div>
          <figure className="min-w-0 border border-[#122552]/10 bg-white p-3 shadow-sm sm:p-5">
            <a href={image.src} target="_blank" rel="noopener noreferrer" aria-label={`View ${name} location plan at full size (opens in a new tab)`} className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#236A9E]">
              <Image src={image.src} alt={image.alt} width={image.width} height={image.height} unoptimized className="mx-auto h-auto max-h-[650px] w-full object-contain" />
              <span className="mt-4 flex min-h-12 items-center justify-between gap-4 border-t border-[#122552]/15 px-2 pt-4 text-sm font-semibold text-[#173966]">View full-size location plan<ArrowUpRight size={19} aria-hidden="true" className="shrink-0" /></span>
            </a>
            <figcaption className="px-2 pb-1 pt-2 text-xs leading-6 text-[#52647B]">Schematic location guide; not to scale. Use Google Maps for current navigation.</figcaption>
          </figure>
        </div>
        {embed && <iframe src={embed} title={`${name} Google Maps location`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="mt-10 h-[360px] w-full border-0"/>}
      </div>
    </section>
  );
}