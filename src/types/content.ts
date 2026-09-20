export type AmenityStatus = "available" | "proposed" | "underDevelopment" | "operational" | "unknown";

export interface Amenity { name: string; status: AmenityStatus; icon: string }
export interface ProjectDocument { name: string; url?: string }
export interface Project {
  id: string;
  slug: string;
  name: string;
  location: string;
  status: string;
  type: string;
  tagline: string;
  heroImage?: string;
  featuredImage?: string;
  thumbnail?: string;
  lifestyleImage?: string;
  published: boolean;
  featured: boolean;
  overview: string;
  facts: { label: string; value: string }[];
  pricing: { label: string; price: string }[];
  plotSizes: string[];
  amenities: Amenity[];
  infrastructure: { name: string; detail?: string; status: AmenityStatus }[];
  gallery: { src?: string; category: string; alt: string }[];
  connectivity: { place: string; distance: string }[];
  documents: ProjectDocument[];
  financePartners: string[];
  videoUrl?: string;
  brochureUrl?: string;
  directionsUrl?: string;
  legal: {
    promoter?: string;
    developer?: string;
    marketingCompany?: string;
    salesPartner?: string;
    reraNumber?: string;
    approvalNumber?: string;
    disclaimer: string;
  };
  faq: { question: string; answer: string }[];
  seo: { title: string; description: string };
}
