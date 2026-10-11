import { Icon } from "@/components/ui/icon";
import { TONES } from "@/lib/tones";
import { cn } from "@/lib/utils";
import type { AuthCategory } from "@/types/content";

export function MarketplaceCategories({ categories }: { categories: AuthCategory[] }) {
  return (
    <ul className="grid grid-cols-5 gap-3">
      {categories.map(({ key, label, caption, icon, tone }) => (
        <li key={key} className={cn("flex min-h-[100px] flex-col items-center gap-1 rounded-xl px-1.5 py-3 text-center transition-transform duration-200 hover:-translate-y-1", TONES[tone].tile)}>
          <Icon name={icon} className={cn("size-5", TONES[tone].icon)} />
          <span className={cn("mt-1 text-[10px] leading-tight font-semibold", TONES[tone].icon)}>{label}</span>
          <span className="text-[10px] leading-tight text-slate-500">{caption}</span>
        </li>
      ))}
    </ul>
  );
}
