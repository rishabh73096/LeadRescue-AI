import type { Role } from "@/config/auth";

export const ROLE_LABELS: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  staff: "Staff",
  user: "User",
};

export function normalizeRole(value: unknown): Role {
  const key = String(value ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (key === "admin" || key === "superadmin" || key === "super_admin") return "admin";
  if (key === "staff") return "staff";
  if (key === "user") return "user";
  return "owner";
}
