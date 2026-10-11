import { Activity, BadgeCheck, BatteryCharging, Bot, Calculator, Camera, Car, Check, Clock, Cog, FileText, Fuel, Gauge, Gavel, Headset, Heart, House, Landmark, LayoutGrid, Lock, MapPin, MessageCircle, Rotate3d, ScanBarcode, ScanEye, Share2, ShieldCheck, ShieldHalf, ShoppingBag, ShoppingCart, Sparkles, Star, Store, TrendingUp, Truck, User, Users, Wrench, Zap, type LucideProps } from "lucide-react";

const ICONS = {
  activity: Activity,
  "badge-check": BadgeCheck,
  "battery-charging": BatteryCharging,
  bot: Bot,
  calculator: Calculator,
  camera: Camera,
  check: Check,
  clock: Clock,
  "file-text": FileText,
  fuel: Fuel,
  gauge: Gauge,
  heart: Heart,
  "layout-grid": LayoutGrid,
  "map-pin": MapPin,
  "message-circle": MessageCircle,
  "rotate-3d": Rotate3d,
  "scan-barcode": ScanBarcode,
  "scan-eye": ScanEye,
  "share-2": Share2,
  star: Star,
  store: Store,
  cog: Cog,
  user: User,
  "trending-up": TrendingUp,
  wrench: Wrench,
  car: Car,
  gavel: Gavel,
  headset: Headset,
  house: House,
  landmark: Landmark,
  lock: Lock,
  "shield-check": ShieldCheck,
  "shield-half": ShieldHalf,
  "shopping-bag": ShoppingBag,
  "shopping-cart": ShoppingCart,
  sparkles: Sparkles,
  truck: Truck,
  users: Users,
  zap: Zap,
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Component = ICONS[name] ?? Sparkles;
  return <Component {...props} />;
}
