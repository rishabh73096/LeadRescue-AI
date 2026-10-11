"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "!rounded-xl !border !px-4 !py-3.5 !font-sans !text-sm !font-medium !shadow-[0_10px_30px_-10px_rgba(15,157,117,0.35)]",
          default: "!bg-white !text-slate-800 !border-slate-200",
          success: "!bg-[#ecfdf3] !text-[#067647] !border-[#abefc6]",
          error: "!bg-[#fff1f3] !text-[#c01048] !border-[#fecdd6]",
          warning: "!bg-[#fffaeb] !text-[#b54708] !border-[#fedf89]",
          info: "!bg-[#f1eefe] !text-[#4f3fd1] !border-[#d9d3f7]",
          closeButton: "!bg-white !text-slate-500 !border-slate-200 hover:!bg-slate-50",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
