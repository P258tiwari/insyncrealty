import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { PrivacyControls } from "@/components/layout/PrivacyControls";
import { company } from "@/content/company";
const display = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-cormorant", weight: ["400", "500", "600"], display: "swap" });
const body = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://insyncrealty.in";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl), title: { default: "Insync Realty | Real Value. Real Trust.", template: "%s | Insync Realty" }, description: company.description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_IN", siteName: company.name, title: "Insync Realty | Real Value. Real Trust.", description: company.description, images: ["/images/home/insync-hero.webp"] },
  twitter: { card: "summary_large_image", title: "Insync Realty | Real Value. Real Trust.", description: company.description, images: ["/images/home/insync-hero.webp"] },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organization = { "@context": "https://schema.org", "@type": "Organization", name: company.name, url: siteUrl, slogan: company.tagline, email: company.email, telephone: company.phone, logo: siteUrl + "/images/brand/insync-realty.svg", sameAs: Object.values(company.socialLinks) };
  return <html lang="en" className={display.variable + " " + body.variable}><body>
    <a href="#main-content" className="skip-link">Skip to content</a><Header/><main id="main-content">{children}</main><Footer/><PrivacyControls/><FloatingWhatsApp/><MobileBottomBar/>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }}/>
  </body></html>;
}
