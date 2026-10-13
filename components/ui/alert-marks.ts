import { CircleCheck, CircleX, Info, TriangleAlert, type LucideIcon } from "lucide-react";

// Status icons shared by the toast (and any future alert).
export type AlertTone = "success" | "error" | "warning" | "info";

export const ALERT_MARKS: Record<AlertTone, LucideIcon> = {
  success: CircleCheck,
  error: CircleX,
  warning: TriangleAlert,
  info: Info,
};
