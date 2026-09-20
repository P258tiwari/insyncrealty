import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { company, whatsappUrl } from "@/content/company";
export const metadata: Metadata = { title: "Thank You", robots: { index: false, follow: false } };
export default function ThankYouPage() { return <section className="dark flex min-h-[80vh] items-center pb-24 pt-40"><div className="container-site text-center"><CheckCircle2 size={48} className="mx-auto text-[#3084C2]"/><h1 className="display-lg mt-8">Thank You. We’ve Received Your Enquiry.</h1><p className="mx-auto mt-6 max-w-xl text-white/60">Your details have been recorded. You can also reach Insync Realty directly or continue exploring our current projects.</p><div className="mt-9 flex flex-wrap justify-center gap-3"><Button href={`tel:${company.phoneHref}`} variant="secondary">Call</Button><Button href={whatsappUrl("Hello Insync Realty, I recently submitted an enquiry on your website.")} variant="outline" target="_blank">WhatsApp</Button><Button href="/projects" variant="outline">Explore Projects</Button></div></div></section>; }
