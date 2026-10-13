import { ApiError } from "@/lib/api";
import { toast, type ToastAction } from "@/components/ui/toast";

export function errorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return fallback;
}

let counter = 0;
const nextId = () => `notify-${++counter}`;

// One entry point for every toast in the app. Each kind has its own look (Kobra Toast):
//   message      plain text
//   description  bold title with a second line of detail
//   action       a button inside the toast (e.g. Undo)
//   promise      spinner while working, then turns into success or error
//   success / error / warning / info   coloured icon per kind
export const notify = {
  message: (message: string) => toast({ message }),
  description: (message: string, description: string) => toast({ message, description }),
  action: (message: string, action: ToastAction, description?: string) => toast({ message, description, action }),
  success: (message: string, description?: string) => toast({ message, description, state: "success" }),
  info: (message: string, description?: string) => toast({ message, description, state: "info" }),
  warning: (message: string, description?: string) => toast({ message, description, state: "warning", lifetime: 4500 }),
  error: (error: unknown, description?: string) => {
    const message = errorMessage(error);
    // same id = the same error replaces itself instead of piling up
    toast({ id: message, message, description, state: "error", lifetime: 5000 });
  },
  promise: async <T>(promise: Promise<T>, messages: { loading: string; success: string }) => {
    const id = nextId();
    toast({ id, message: messages.loading, state: "pending" });
    try {
      await promise;
      toast({ id, message: messages.success, state: "success" });
    } catch (e) {
      toast({ id, message: errorMessage(e), state: "error", lifetime: 5000 });
    }
  },
};
