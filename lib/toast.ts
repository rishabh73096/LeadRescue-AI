import { toast } from "sonner";
import { ApiError } from "@/lib/api";

export function errorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return fallback;
}

export const notify = {
  success: (message: string) => toast.success(message),
  info: (message: string) => toast.info(message),
  warning: (message: string) => toast.warning(message),
  error: (error: unknown) => {
    const message = errorMessage(error);
    toast.error(message, { id: message });
  },
  promise: <T>(promise: Promise<T>, messages: { loading: string; success: string }) =>
    toast.promise(promise, { loading: messages.loading, success: messages.success, error: (e) => errorMessage(e) }),
};
