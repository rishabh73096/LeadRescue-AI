import type { ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface AuthFieldProps {
  label: ReactNode;
  htmlFor: string;
  aside?: ReactNode;
  error?: string;
  hint?: ReactNode;
  className?: string;
  labelClassName?: string;
  children: ReactNode;
}

export function AuthField({ label, htmlFor, aside, error, hint, className, labelClassName, children }: AuthFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={htmlFor} className={cn("text-xs font-semibold tracking-wide text-slate-700 uppercase", labelClassName)}>
          {label}
        </Label>
        {aside}
      </div>
      {children}
      {hint && !error ? <p className="text-xs text-slate-500">{hint}</p> : null}
      {error ? <p className="text-destructive text-xs">{error}</p> : null}
    </div>
  );
}

export function AuthInput({ icon: Icon, className, ...props }: { icon?: LucideIcon } & ComponentProps<typeof Input>) {
  return (
    <div className="relative">
      {Icon ? <Icon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" /> : null}
      <Input variant="auth" className={cn(Icon && "pl-11", className)} {...props} />
    </div>
  );
}

export function AuthPasswordInput({ icon: Icon, className, ...props }: { icon?: LucideIcon } & Omit<ComponentProps<typeof PasswordInput>, "type">) {
  return (
    <div className="relative">
      {Icon ? <Icon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" /> : null}
      <PasswordInput variant="auth" className={cn(Icon && "pl-11", className)} {...props} />
    </div>
  );
}

export function AuthTextarea({ className, ...props }: ComponentProps<typeof Textarea>) {
  return <Textarea variant="auth" className={cn("min-h-28 resize-none", className)} {...props} />;
}
