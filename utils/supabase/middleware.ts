import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { GUARDS_ENABLED } from "@/config/auth";
import { loginUrl, safeNext } from "@/lib/safe-next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const PROTECTED = ["/dashboard", "/choose-plan", "/leads", "/pipeline", "/follow-ups", "/replies", "/import", "/settings", "/admin"];
const isAdminLogin = (path: string) => path === "/admin/login";
const GUEST_ONLY = ["/login", "/signup"];
const WORKSPACE = ["/dashboard", "/leads", "/pipeline", "/follow-ups", "/replies", "/import", "/settings"];

const matches = (path: string, list: string[]) => list.some((p) => path === p || path.startsWith(`${p}/`));

// Refreshes the Supabase session cookie and applies route-level auth redirects.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getUser() validates the token with Supabase; do not swap for getSession() here.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;
  const redirect = (to: string) => {
    const res = NextResponse.redirect(new URL(to, request.url));
    // keep any refreshed auth cookies on the redirect
    response.cookies.getAll().forEach((c) => res.cookies.set(c));
    return res;
  };

  if (!GUARDS_ENABLED) return response;

  if (!user && matches(pathname, PROTECTED) && !isAdminLogin(pathname)) {
    const target = `${pathname}${search}`;
    return redirect(pathname.startsWith("/admin") ? `/admin/login?next=${encodeURIComponent(target)}` : loginUrl(target));
  }
  if (user && matches(pathname, GUEST_ONLY)) return redirect(safeNext(request.nextUrl.searchParams.get("next")));

  // Extra server-side checks (the browser cannot skip these). Link prefetches are skipped; the real visit is checked.
  const prefetch = request.headers.has("next-router-prefetch") || request.headers.get("purpose") === "prefetch";
  if (user && !prefetch) {
    // 1) Admin console: the signed-in account must be listed in platform_admins.
    if (pathname.startsWith("/admin") && !isAdminLogin(pathname)) {
      const { data } = await supabase.from("platform_admins").select("user_id").eq("user_id", user.id).maybeSingle();
      if (!data) return redirect("/admin/login?error=not-admin");
    }

    // 2) Customer workspace: needs an active, unexpired plan (platform admins are exempt).
    if (matches(pathname, WORKSPACE)) {
      const [admin, sub] = await Promise.all([
        supabase.from("platform_admins").select("user_id").eq("user_id", user.id).maybeSingle(),
        supabase.from("subscriptions").select("status,current_period_end").eq("user_id", user.id).maybeSingle(),
      ]);
      const paid = sub.data?.status === "active" && new Date(sub.data.current_period_end).getTime() > Date.now();
      // if the database cannot be reached, let the page open (the page itself re-checks and RLS still protects data)
      const unreachable = Boolean(admin.error || sub.error);
      if (!admin.data && !paid && !unreachable) return redirect("/choose-plan");
    }
  }

  return response;
}
