import type { Metadata } from "next";
import { ForgotPasswordFlow } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your account password",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordFlow />;
}
