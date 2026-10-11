export const TONES = {
  violet: { tile: "bg-[#f1eefe]", icon: "text-[#5b46e5]" },
  blue: { tile: "bg-[#e8f0ff]", icon: "text-[#2f5bea]" },
  indigo: { tile: "bg-[#eceeff]", icon: "text-[#4f46e5]" },
  green: { tile: "bg-[#e6f7ee]", icon: "text-[#1f8f5a]" },
  purple: { tile: "bg-[#f1eafd]", icon: "text-[#7c3aed]" },
  pink: { tile: "bg-[#fdeaf2]", icon: "text-[#d6336c]" },
  orange: { tile: "bg-[#fff0e3]", icon: "text-[#e5601a]" },
  teal: { tile: "bg-[#e3f6f1]", icon: "text-[#1c8a75]" },
} as const;

export type Tone = keyof typeof TONES;
