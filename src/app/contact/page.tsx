import { pageMetadata } from "@/lib/metadata";
import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { company, whatsappUrl } from "@/content/company";
import { LeadForm } from "@/components/forms/LeadForm";
import { MapSection } from "@/components/projects/MapSection";
import { SectionHeading } from "@/components/shared/SectionHeading";

export const metadata = pageMetadata("Contact", "Contact Insync Realty to discuss current projects, plot availability or arranging a site visit.", "/contact");

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ buyerType?: string }> }) {
  const buyerType = (await searchParams).buyerType || "";
  const whatsappHref = whatsappUrl("Hello Insync Realty, I would like to know more about your projects.");
  const details = [
    { icon: Phone, label: "Call", value: company.phone, href: `tel:${company.phoneHref}` },
    { icon: MessageCircle, label: "WhatsApp", value: "Start a conversation", href: whatsappHref },
    { icon: Mail, label: "Email", value: company.email, href: `mailto:${company.email}` },
    { icon: MapPin, label: "Visit", value: company.officeAddress, href: company.mapUrl },
  ];

  return <>
    <section className="dark section-pad pt-44">
      <div className="container-site">
        <p className="eyebrow mb-8 text-[#3084C2]">Contact</p>
        <h1 className="display-xl max-w-4xl">A Better Property Conversation <span className="text-[#3084C2]">Starts Here.</span></h1>
        <p className="mt-8 max-w-xl text-lg leading-8 text-white/60">Tell us what you are considering. We’ll help you explore the relevant current information.</p>
      </div>
    </section>

    <section className="section-pad">
      <div className="container-site grid gap-px bg-[#122552]/15 sm:grid-cols-2 lg:grid-cols-4">
        {details.map(({ icon: Icon, label, value, href }) => <a href={href} target={label === "WhatsApp" || label === "Visit" ? "_blank" : undefined} rel={label === "WhatsApp" || label === "Visit" ? "noopener noreferrer" : undefined} key={label} className="bg-[#F7F9FC] p-7 transition-colors hover:bg-white">
          <Icon size={22} className="text-[#236A9E]"/>
          <p className="mt-10 text-[.62rem] font-bold uppercase tracking-widest text-[#52647B]">{label}</p>
          <p className="font-display mt-2 text-2xl">{value}</p>
        </a>)}
      </div>
    </section>

    <section id="enquiry" className="section-pad bg-[#E2EAF4]">
      <div className="container-site grid overflow-hidden shadow-[0_28px_80px_rgba(18,37,82,.10)] lg:grid-cols-[.78fr_1.22fr]">
        <aside className="flex min-h-[42rem] flex-col bg-[#173966] p-8 text-white sm:p-12 lg:p-16">
          <SectionHeading light eyebrow="Enquiry" title="Let’s Understand What You’re Looking For." intro="Share a few details and our team will connect with relevant information—not a generic sales pitch."/>
          <div className="mt-auto grid gap-6 border-t border-white/15 pt-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="flex gap-4">
              <Clock3 size={20} strokeWidth={1.5} className="mt-1 shrink-0 text-[#B8DCFA]"/>
              <div><p className="text-[.62rem] font-bold uppercase tracking-[.18em] text-[#B8DCFA]">Business Hours</p><p className="mt-2 text-sm leading-6 text-white/75">{company.businessHours}</p></div>
            </div>
            <div className="flex gap-4">
              <MessageCircle size={20} strokeWidth={1.5} className="mt-1 shrink-0 text-[#B8DCFA]"/>
              <div><p className="text-[.62rem] font-bold uppercase tracking-[.18em] text-[#B8DCFA]">Prefer WhatsApp?</p><a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-white/75 transition-colors hover:text-white">Start a conversation</a></div>
            </div>
          </div>
        </aside>

        <div className="bg-[#FFFFFF] p-8 sm:p-12 lg:p-16">
          <p className="text-[.64rem] font-bold uppercase tracking-normal text-[#236A9E]">Your Property Brief</p>
          <h2 className="font-display mt-4 max-w-xl text-4xl leading-tight text-[#182C49] sm:text-5xl">Tell us what matters to you.</h2>
          <LeadForm mode="contact" defaultBuyerType={buyerType} className="mt-10 lg:mt-12"/>
        </div>
      </div>
    </section>

    <section><MapSection directionsUrl={company.mapUrl}/></section>
  </>;
}
