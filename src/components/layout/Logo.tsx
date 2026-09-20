import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ light = false }: { light?: boolean }) {
  return <Link prefetch={false}
    href="/"
    aria-label="Insync Realty home"
    className="inline-flex min-h-11 shrink-0 items-center"
  >
    <Image
      src={light ? "/images/brand/insync-realty-white.webp" : "/images/brand/insync-realty.svg"}
      alt=""
      width={1152}
      height={360}
      sizes="(max-width: 639px) 148px, (max-width: 1023px) 164px, 176px"
      loading="eager"
      className={cn("h-auto w-[148px] sm:w-[164px] lg:w-[176px]", light && "drop-shadow-[0_2px_8px_rgba(0,0,0,.28)]")}
    />
  </Link>;
}
