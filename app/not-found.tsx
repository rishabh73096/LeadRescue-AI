import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 py-16 text-center">
      <Logo className="mb-8 w-32" />
      <p className="text-brand text-sm font-bold tracking-widest">ERROR 404</p>
      <h1 className="font-heading text-brand mt-2 text-3xl font-bold sm:text-4xl">This page doesn&apos;t exist</h1>
      <Link href="/" className={cn(buttonVariants({ variant: "brand", size: "xl" }), "mt-8 rounded-full")}>
        Back to home
      </Link>
    </main>
  );
}
