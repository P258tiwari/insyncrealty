import { ChevronDown } from "lucide-react";
export function Accordion({ items }: { items: { question: string; answer: string }[] }) {
  return <div className="border-t border-current/15">{items.map(item => <details key={item.question} className="group border-b border-current/15"><summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 font-medium [&::-webkit-details-marker]:hidden">{item.question}<ChevronDown aria-hidden="true" size={18} className="shrink-0 transition-transform group-open:rotate-180"/></summary><p className="max-w-3xl pb-6 text-sm leading-7">{item.answer}</p></details>)}</div>;
}
