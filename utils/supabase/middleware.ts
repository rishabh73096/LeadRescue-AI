import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { loginUrl, safeNext } from "@/lib/safe-next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const PROTECTED = ["/dashboard", "/choose-plan", "/leads", "/pipeline", "/follow-ups", "/replies", "/import", "/settings"];
const GUEST_ONLY = ["/login", "/signup"];

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

  if (!user && matches(pathname, PROTECTED)) return redirect(loginUrl(`${pathname}${search}`));
  if (user && matches(pathname, GUEST_ONLY)) return redirect(safeNext(request.nextUrl.searchParams.get("next")));

  return response;
}
