import { Icon } from "@/components/ui/icon";
import type { AuthTrustFeature } from "@/types/content";

export function TrustFeatures({ features }: { features: AuthTrustFeature[] }) {
  return (
    <ul className="grid grid-cols-3 gap-6 border-t border-slate-200/70 pt-8">
      {features.map(({ title, caption, icon }) => (
        <li key={title} className="group flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#dfe5ff] bg-[#eef1ff] transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6">
            <Icon name={icon} className="size-5 text-[#3b5bdb]" />
          </span>
          <span>
            <span className="block text-sm leading-tight font-bold text-slate-900">{title}</span>
            <span className="mt-0.5 block text-xs leading-snug text-slate-500">{caption}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
