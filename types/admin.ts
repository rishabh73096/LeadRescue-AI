export interface Profile {
  id: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  role?: "owner" | "admin" | "staff";
  created_at: string;
}

export type PaymentStatus = "pending" | "verified" | "rejected";

export interface Payment {
  id: string;
  user_id: string;
  plan: string;
  amount_inr: number;
  upi_ref: string;
  status: PaymentStatus;
  created_at: string;
}

export interface SubscriptionRow {
  user_id: string;
  plan: string;
  status: "active" | "expired";
  current_period_end: string;
  updated_at: string;
}

export interface AdminData {
  profiles: Profile[];
  payments: Payment[];
  subscriptions: SubscriptionRow[];
  demo: boolean;
}
