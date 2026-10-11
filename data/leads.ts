import { DAY_MS } from "@/lib/date";
import type { Lead } from "@/types/lead";

// Demo leads shown until a real backend (Supabase) is connected.
export function seedLeads(now = Date.now()): Lead[] {
  const ago = (d: number) => new Date(now - d * DAY_MS).toISOString();
  const at = (d: number) => new Date(now + d * DAY_MS).toISOString();
  const base = { email: "", value: 0 };
  return [
    { ...base, id: "l1", name: "Priya Sharma", phone: "+919876543210", email: "priya@example.com", source: "website", service: "Deep cleaning, 3BHK", message: "Need deep cleaning before Diwali. What is the price?", status: "new", value: 6500, nextFollowUpAt: at(0), createdAt: ago(2), updatedAt: ago(2) },
    { ...base, id: "l2", name: "Rahul Verma", phone: "+919811122233", source: "whatsapp", service: "Sofa and carpet cleaning", message: "Can you come this Saturday?", status: "contacted", value: 3200, nextFollowUpAt: ago(1), createdAt: ago(4), updatedAt: ago(3) },
    { ...base, id: "l3", name: "Green Valley Society", phone: "+919900011122", email: "admin@greenvalley.in", source: "referral", service: "Monthly office cleaning", message: "Looking for a monthly contract for 2 floors.", status: "quote_sent", value: 24000, nextFollowUpAt: at(1), createdAt: ago(6), updatedAt: ago(3) },
    { ...base, id: "l4", name: "Anita Desai", phone: "+919822334455", source: "phone", service: "Kitchen deep clean", message: "Called yesterday, wants a quote.", status: "new", value: 2500, nextFollowUpAt: at(2), createdAt: ago(1), updatedAt: ago(1) },
    { ...base, id: "l5", name: "Sunrise Salon", phone: "+919733445566", email: "hello@sunrise.in", source: "email", service: "Weekly salon cleaning", message: "Please share rates for weekly service.", status: "won", value: 8000, nextFollowUpAt: null, createdAt: ago(12), updatedAt: ago(5) },
    { ...base, id: "l6", name: "Mohit Jain", phone: "+919644556677", source: "other", service: "Move-out cleaning", message: "Found a cheaper option, will let you know.", status: "lost", value: 4000, nextFollowUpAt: null, createdAt: ago(15), updatedAt: ago(9) },
  ];
}
