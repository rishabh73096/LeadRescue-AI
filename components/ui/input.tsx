import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const inputVariants = cva(
  "h-8 w-full min-w-0 rounded-lg px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      variant: {
        default:
          "border border-input bg-transparent placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:bg-input/50 dark:bg-input/30 dark:disabled:bg-input/80",
        soft: "border border-transparent bg-brand-soft/70 text-foreground placeholder:text-brand/45 focus-visible:border-brand focus-visible:bg-background focus-visible:ring-brand/25 disabled:bg-brand-soft/40 dark:bg-brand-soft/10 dark:focus-visible:bg-background",
        auth: "h-12 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus-visible:border-brand focus-visible:ring-brand/20",
        panel: "h-12 rounded-lg border border-transparent bg-[#ebf8f3] text-sm text-slate-800 placeholder:text-slate-400 focus-visible:border-brand focus-visible:bg-white focus-visible:ring-brand/20 disabled:opacity-60",
        otp: "h-14 rounded-xl border border-transparent bg-slate-50 px-0 text-center text-xl font-semibold text-slate-900 focus-visible:border-brand focus-visible:bg-white focus-visible:ring-brand/20 data-[filled=true]:bg-brand-soft",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Input({
  className,
  type,
  variant,
  ...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return (
    <InputPrimitive
      key={props.defaultValue === undefined ? undefined : String(props.defaultValue)}
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Input, inputVariants }
