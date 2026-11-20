"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { authClient, getJwtToken } from "@/lib/auth-client";
import { clearAccessToken, setAccessToken } from "@/lib/token";
import type { AuthUser, UserRole } from "@/lib/types";

const GOOGLE_FLAG = "rentworx_google_login";

type SessionUser = {
  id?: string;
  name?: string;
  email?: string;
  image?: string | null;
  role?: UserRole;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (input: {
    name: string;
    email: string;
    password: string;
    image?: string;
  }) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function mapSessionUser(user: SessionUser): AuthUser {
  return {
    id: user.id ?? "",
    name: user.name ?? "RentWorx User",
    email: user.email ?? "",
    image: user.image ?? undefined,
    role: user.role ?? "customer",
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    try {
      const { data: session } = await authClient.getSession();

      if (!session?.user) {
        clearAccessToken();
        setUser(null);
        return;
      }

      const sessionUser = mapSessionUser(session.user as SessionUser);

      try {
        const token = await getJwtToken();
        setAccessToken(token);

        const me = await api.get<AuthUser>("/auth/me");
        setUser(me.data);
      } catch {
        clearAccessToken();
        setUser(sessionUser);
      }

      if (typeof window !== "undefined" && window.sessionStorage.getItem(GOOGLE_FLAG)) {
        window.sessionStorage.removeItem(GOOGLE_FLAG);
        toast.success("Signed in with Google");
      }
    } catch {
      clearAccessToken();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      await bootstrap();
      if (active) setIsLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [bootstrap]);

  const loginWithEmail = useCallback(
    async (email: string, password: string) => {
      const result = await authClient.signIn.email({ email, password });

      if (result.error) {
        throw new Error(result.error.message ?? "Unable to sign in");
      }

      await bootstrap();
    },
    [bootstrap],
  );

  const registerWithEmail = useCallback(
    async (input: {
      name: string;
      email: string;
      password: string;
      image?: string;
    }) => {
      const result = await authClient.signUp.email({
        name: input.name,
        email: input.email,
        password: input.password,
        image: input.image,
      } as Parameters<typeof authClient.signUp.email>[0]);

      if (result.error) {
        throw new Error(result.error.message ?? "Unable to create account");
      }

      await bootstrap();
    },
    [bootstrap],
  );

  const loginWithGoogle = useCallback(async () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(GOOGLE_FLAG, "1");
    }

    const result = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });

    if (result.error) {
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(GOOGLE_FLAG);
      }
      throw new Error(result.error.message ?? "Unable to sign in with Google");
    }
  }, []);

  const logout = useCallback(async () => {
    await authClient.signOut();
    clearAccessToken();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      refresh: bootstrap,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      logout,
    }),
    [
      user,
      isLoading,
      bootstrap,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
