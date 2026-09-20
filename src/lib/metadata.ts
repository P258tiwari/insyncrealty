import type { Metadata } from "next";
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return { title, description, alternates: { canonical: path },
    openGraph: { type: "website", siteName: "Insync Realty", title: title + " | Insync Realty", description, url: path, images: ["/images/home/insync-hero.webp"] },
    twitter: { card: "summary_large_image", title: title + " | Insync Realty", description, images: ["/images/home/insync-hero.webp"] },
  };
}
