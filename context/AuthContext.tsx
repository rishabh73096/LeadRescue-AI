"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { clearLocalStores } from "@/lib/local-store";
import { resetAllData } from "@/lib/collection";
import { getProfile, logout, normalizeUser } from "@/services/auth";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@/types";

type Status = "loading" | "authenticated" | "guest";

interface AuthValue {
  user: User | null;
  status: Status;
  signIn: (user?: User | null) => Promise<User | null>;
  signOut: () => Promise<void>;
  refresh: () => Promise<User | null>;
}

const AuthContext = createContext<AuthValue>({
  user: null,
  status: "loading",
  signIn: async () => null,
  signOut: async () => {},
  refresh: async () => null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  const apply = useCallback((next: User | null) => {
    setUser(next);
    setStatus(next ? "authenticated" : "guest");
    return next;
  }, []);

  const refresh = useCallback(async () => apply(await getProfile().catch(() => null)), [apply]);

  useEffect(() => {
    const supabase = createClient();
    // onAuthStateChange fires INITIAL_SESSION on mount, so it also performs the first load.
    let lastId: string | null | undefined;
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") clearLocalStores();
      // switch the cached workspace data when the signed-in user actually changes
      const id = session?.user.id ?? null;
      if (lastId !== undefined && id !== lastId) resetAllData();
      lastId = id;
      apply(session?.user ? normalizeUser(session.user) : null);
    });
    return () => data.subscription.unsubscribe();
  }, [apply]);

  const signIn = useCallback(async (known?: User | null) => (known ? apply(known) : refresh()), [apply, refresh]);

  const signOut = useCallback(async () => {
    await logout();
    clearLocalStores();
    apply(null);
  }, [apply]);

  const value = useMemo(() => ({ user, status, signIn, signOut, refresh }), [user, status, signIn, signOut, refresh]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthState = () => useContext(AuthContext);

export function useAuth(): User | null {
  return useContext(AuthContext).user;
}

export default AuthContext;
