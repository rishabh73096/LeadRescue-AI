import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const textareaVariants = cva(
  "flex field-sizing-content min-h-16 w-full rounded-lg px-2.5 py-2 text-base transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      variant: {
        default:
          "border border-input bg-transparent placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:bg-input/50 dark:bg-input/30 dark:disabled:bg-input/80",
        soft: "border border-transparent bg-brand-soft/70 text-foreground placeholder:text-brand/45 focus-visible:border-brand focus-visible:bg-background focus-visible:ring-brand/25 disabled:bg-brand-soft/40 dark:bg-brand-soft/10 dark:focus-visible:bg-background",
        panel: "rounded-lg border border-transparent bg-[#ebf8f3] px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:border-brand focus-visible:bg-white focus-visible:ring-brand/20",
        auth: "rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:border-brand focus-visible:ring-brand/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Textarea({
  className,
  variant,
  ...props
}: React.ComponentProps<"textarea"> & VariantProps<typeof textareaVariants>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Textarea, textareaVariants }
