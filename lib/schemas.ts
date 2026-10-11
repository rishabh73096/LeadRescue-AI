import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Enter a valid email address");

export const nameSchema = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .min(2, `${label} must be at least 2 characters`)
    .max(40, `${label} is too long`)
    .regex(/^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]*$/u, `${label} can only contain letters`);

export const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .refine((v) => /^\+91[6-9]\d{9}$/.test(v), "Enter a valid 10-digit Indian mobile number");

export const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-z]/, "Password needs a lowercase letter")
  .regex(/[A-Z]/, "Password needs an uppercase letter")
  .regex(/\d/, "Password needs a number")
  .regex(/[^A-Za-z0-9]/, "Password needs a special symbol");

export const otpSchema = z
  .string()
  .trim()
  .min(1, "Enter the code we emailed you")
  .regex(/^\d{4}$/, "Enter the 4-digit code");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  firstName: nameSchema("First name"),
  lastName: nameSchema("Last name"),
  email: emailSchema,
  phone: phoneSchema,
  role: z.string().min(1, "Select your role"),
  password: passwordSchema,
  terms: z.literal(true, { error: "Please agree to the Terms of Service" }),
});

export const forgotPasswordSchema = z.object({ email: emailSchema });

export const codeSchema = z.object({ otp: otpSchema });

export const newPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  firstName: nameSchema("First name"),
  lastName: nameSchema("Last name"),
  phone: phoneSchema,
});

export function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Invalid value";
}
