import type { LucideIcon } from "lucide-react";

export interface Tile {
  icon: LucideIcon;
  bg: string;
  fg?: string;
}

export interface HeadlineLine {
  text: string;
  tiles?: Tile[];
  muted?: boolean;
}

export interface FlowSource {
  name: string;
  meta: string;
  icon: LucideIcon;
  color: string;
}

export interface FlowRow {
  name: string;
  text: string;
  source: number;
}

export type BentoItem =
  | { type: "hero"; title: string; desc: string; chips: LucideIcon[]; stat: { value: string; label: string } }
  | { type: "mock"; title: string; desc: string; blocks: { label: string; grow: number }[] }
  | { type: "stat"; title: string; desc: string; value: string; dark?: boolean }
  | { type: "chips"; title: string; desc: string; chips: { icon: LucideIcon; label: string }[] }
  | { type: "wave"; title: string; desc: string; icon: LucideIcon }
  | { type: "icon"; title: string; desc: string; icon: LucideIcon }
  | { type: "pills"; title: string; desc: string; pills: { label: string; color: string }[] }
  | { type: "footer"; title: string; desc: string; icon: LucideIcon };

export interface Plan {
  name: string;
  tagline: string;
  price: string;
  features: string[];
  featured?: boolean;
}

export interface LandingContent {
  headline: HeadlineLine[];
  subhead: string;
  heroNote: string;
  flow: {
    title: string;
    sub: string;
    sources: FlowSource[];
    panel: { title: string; scope: string; badge: string; pinned: string; rows: FlowRow[]; placeholder: string };
  };
  bento: { title: string; sub: string; items: BentoItem[] };
  audience: { eyebrow: string; title: string; titleMuted: string; cards: { who: string; role: string; scenario: string; icon: LucideIcon }[] };
  pricing: { title: string; sub: string; plans: Plan[] };
  faq: { q: string; a: string }[];
  cta: { title: string; sub: string };
}
