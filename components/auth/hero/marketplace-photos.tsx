import { Icon } from "@/components/ui/icon";
import { Photo } from "@/components/ui/photo";
import type { AuthCategory } from "@/types/content";

export function MarketplacePhotos({ categories }: { categories: AuthCategory[] }) {
  return (
    <ul className="grid grid-cols-5 gap-3">
      {categories.map(({ key, label, photoLabel, icon, image, fallback }) => (
        <li key={key}>
          <div className="overflow-hidden rounded-2xl shadow-sm">
            <Photo src={image} fallback={fallback} sizes="160px" aria-label={label} className="relative h-[136px] transition-transform duration-500 hover:scale-110">
            <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-semibold text-slate-800 shadow-sm">
              <Icon name={icon} className="size-2.5 text-brand" />
              {photoLabel ?? label}
            </span>
          </Photo>
          </div>
        </li>
      ))}
    </ul>
  );
}
