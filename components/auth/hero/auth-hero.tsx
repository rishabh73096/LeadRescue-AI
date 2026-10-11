import { AuthBrand } from "@/components/auth/hero/auth-brand";
import { AuthHeadline } from "@/components/auth/hero/auth-headline";
import { MarketplaceCategories } from "@/components/auth/hero/marketplace-categories";
import { MarketplacePhotos } from "@/components/auth/hero/marketplace-photos";
import { Pop } from "@/components/ui/motion";
import { TrustFeatures } from "@/components/auth/hero/trust-features";
import type { AuthHeroData } from "@/types/content";

export function AuthHero({ content }: { content: AuthHeroData }) {
  return (
    <section className="flex flex-col gap-10">
      <Pop from="left">
        <AuthBrand />
      </Pop>
      <Pop from="left" delay={0.08}>
        <AuthHeadline headline={content.headline} headlineAccent={content.headlineAccent} description={content.description} />
      </Pop>
      <Pop delay={0.16} className="hidden space-y-3 lg:block">
        <MarketplaceCategories categories={content.categories} />
        <MarketplacePhotos categories={content.categories} />
      </Pop>
      <Pop delay={0.24} className="hidden lg:block">
        <TrustFeatures features={content.trust} />
      </Pop>
    </section>
  );
}
