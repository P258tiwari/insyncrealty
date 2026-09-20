import { MapPin } from "lucide-react";
import { Button } from "@/components/shared/Button";

export function MapSection({ directionsUrl }: { directionsUrl?: string }) {
  const embed = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL;
  return <div className="relative min-h-[460px] overflow-hidden bg-[#EAF0F7]">{embed ? <iframe src={embed} title="Project location map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0"/> : <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"><MapPin size={36} className="mb-5 text-[#236A9E]"/><h3 className="font-display text-4xl">Lucknow, Uttar Pradesh</h3><p className="mt-3 max-w-md text-sm leading-7 text-[#52647B]">Open Google Maps for the location and directions to plan your visit.</p>{directionsUrl && <Button href={directionsUrl} target="_blank" variant="dark" className="mt-7">Get Directions</Button>}</div>}</div>;
}
