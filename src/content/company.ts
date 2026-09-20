export const company = {
  name: "Insync Realty",
  tagline: "Real Value. Real Trust.",
  description: "Thoughtfully selected developments, transparent guidance and spaces designed around the future you want to build.",
  phone: "+91 91511 12063",
  phoneHref: "+919151112063",
  whatsapp: "919151112063",
  email: "realtyinsync@gmail.com",
  officeAddress: "Lucknow, Uttar Pradesh", // TODO: add complete office address
  mapUrl: "https://maps.app.goo.gl/bKEhoZpvXy6LeEPP9",
  businessHours: "Contact us to arrange a convenient time.",
  socialLinks: {
    facebook: "https://www.facebook.com/InsyncRealty",
    instagram: "https://www.instagram.com/insyncrealty",
    youtube: "https://www.youtube.com/@InsyncRealty",
    x: "https://x.com/InsyncRealty",
  },
  metrics: { yearsExperience: null, customers: null, projects: null, areaDelivered: null } as Record<string, number | null>,
  leadership: [] as { name: string; role: string; bio?: string; image?: string }[], // TODO: add confirmed team
  mission: "To make property discovery clearer, more considered and meaningfully aligned with each buyer’s needs.",
  vision: "To build a trusted real-estate brand known for thoughtful opportunities, transparent conversations and enduring value.",
  values: [
    { title: "Clarity", text: "Straightforward information that helps buyers understand each opportunity." },
    { title: "Consideration", text: "Recommendations shaped around real needs—not one-size-fits-all selling." },
    { title: "Responsibility", text: "Careful attention to property details, context and documentation." },
    { title: "Continuity", text: "A relationship that continues beyond the first conversation." },
  ],
  legalDisclaimer: "Project information, prices and availability are indicative and subject to change. Buyers should independently verify all details and documents before making a decision. Legal content requires client counsel review.",
};

export const whatsappUrl = (message: string) =>
  `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`;
