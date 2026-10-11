"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 py-16 text-center">
      <Logo className="mb-8 w-32" />
      <div className="bg-destructive/10 text-destructive flex size-14 items-center justify-center rounded-full">
        <TriangleAlert className="size-6" />
      </div>
      <h1 className="font-heading text-brand mt-6 text-3xl font-bold sm:text-4xl">
        Something went wrong
      </h1>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm sm:text-base">
        An unexpected error occurred. You can try again, or head back to the dashboard.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset} variant="brand" size="xl" className="rounded-full">
          Try again
        </Button>
        <Link href="/" className={cn(buttonVariants({ variant: "brand-outline", size: "xl" }), "rounded-full")}>
          Back to home
        </Link>
      </div>
    </main>
  );
}
