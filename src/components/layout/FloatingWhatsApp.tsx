"use client";
import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/content/company";


export function FloatingWhatsApp() { return <a href={whatsappUrl("Hello Insync Realty, I would like to know more about your projects.")} target="_blank" rel="noopener noreferrer" aria-label="Chat with Insync Realty on WhatsApp" className="fixed bottom-7 right-7 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-[#236A9E] text-white shadow-xl transition-transform hover:-translate-y-1 md:flex"><MessageCircle className="text-white" aria-hidden="true" /></a>; }
