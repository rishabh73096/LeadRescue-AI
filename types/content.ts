import type { IconName } from "@/components/ui/icon";
import type { Tone } from "@/lib/tones";

export interface LinkItem {
  label: string;
  href: string;
}

export interface AuthCategory {
  key: string;
  label: string;
  photoLabel?: string;
  caption: string;
  icon: IconName;
  tone: Tone;
  image: string;
  fallback: string;
}

export interface AuthTrustFeature {
  title: string;
  caption: string;
  icon: IconName;
}

export interface AuthHeroData {
  headline: string;
  headlineAccent: string;
  description: string;
  categories: AuthCategory[];
  trust: AuthTrustFeature[];
}
