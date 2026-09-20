import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { href?: string; children: React.ReactNode; variant?: "primary" | "secondary" | "outline" | "dark" | "text-link"; className?: string; type?: "button" | "submit"; onClick?: () => void; disabled?: boolean; target?: string; ariaLabel?: string };

export function Button({ href, children, variant = "primary", className, type = "button", onClick, disabled, target, ariaLabel }: Props) {
  const styles = {
    primary: "bg-[#236A9E] text-white border-[#236A9E] hover:bg-[#173966]",
    secondary: "bg-[#B8DCFA] text-[#122552] border-[#B8DCFA] hover:bg-[#DCEEFF]",
    outline: "bg-transparent border-current hover:bg-white/10",
    dark: "bg-[#122552] text-white border-[#122552] hover:bg-[#204675]",
    "text-link": "border-transparent px-0 py-2 hover:text-[#3084C2]",
  }[variant];
  const common = cn("group inline-flex min-h-12 items-center justify-center gap-3 border px-6 py-3 text-[.72rem] font-bold uppercase tracking-[.15em] transition-colors disabled:cursor-not-allowed disabled:opacity-50", styles, className);
  const content = <>{children}<ArrowUpRight aria-hidden="true" size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></>;
  const textColor = variant === "primary" || variant === "dark" ? "#FFFFFF" : variant === "secondary" ? "#122552" : undefined;
  if (href) return <Link prefetch={false} href={href} className={common} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined} onClick={onClick} aria-label={ariaLabel} style={{ color: textColor }}>{content}</Link>;
  return <button type={type} className={common} onClick={onClick} disabled={disabled} aria-label={ariaLabel} style={{ color: textColor }}>{content}</button>;
}
