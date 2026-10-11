import type { ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const FIELD_LABEL = "text-[13px] font-semibold tracking-normal text-ink normal-case";

interface FormFieldProps {
  label: ReactNode;
  htmlFor: string;
  aside?: ReactNode;
  error?: string;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function FormField({ label, htmlFor, aside, error, hint, className, children }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={htmlFor} className={FIELD_LABEL}>{label}</Label>
        {aside ? <span className="hidden text-xs font-normal text-slate-400 sm:inline">{aside}</span> : null}
      </div>
      {children}
      {hint && !error ? <p className="text-xs text-slate-500">{hint}</p> : null}
      {error ? <p className="text-destructive text-xs">{error}</p> : null}
    </div>
  );
}

export function TextField({ icon: Icon, className, ...props }: { icon?: LucideIcon } & ComponentProps<typeof Input>) {
  return (
    <div className="relative">
      {Icon ? <Icon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-500" /> : null}
      <Input variant="panel" className={cn(Icon && "pl-11", className)} {...props} />
    </div>
  );
}

export function PasswordField({ icon: Icon, className, ...props }: { icon?: LucideIcon } & Omit<ComponentProps<typeof PasswordInput>, "type">) {
  return (
    <div className="relative">
      {Icon ? <Icon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-500" /> : null}
      <PasswordInput variant="panel" className={cn(Icon && "pl-11", className)} {...props} />
    </div>
  );
}

export function TextAreaField({ className, ...props }: ComponentProps<typeof Textarea>) {
  return <Textarea variant="panel" className={cn("min-h-24 resize-none", className)} {...props} />;
}
