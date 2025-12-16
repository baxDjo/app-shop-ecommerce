// src/features/auth/AuthContext.tsx
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { http, setAccessToken } from "../../api/http";
import type { User } from "../../types/User";


type AuthState = {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstname: string,
    lastname: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  ensureFresh: () => Promise<void>;
};

const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, _setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  function applyToken(token: string | null) {
    _setToken(token);
    setAccessToken(token);
  }

  // Au démarrage : pas de /me → pas de 404
  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = (await http("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })) as any;

    const token = data?.accessToken ?? null;
    applyToken(token);

    const u: User = data?.user ??
    {
      id: String(data?.id ?? ""),
      email: String(data?.email ?? email),
      firstname: String(data?.firstname ?? ""),
      lastname: String(data?.lastname ?? ""),
    };

    setUser(u);
  };

  const register = async (
    email: string,
    password: string,
    firstname: string,
    lastname: string
  ) => {
    // ⚠️ ton backend exige EXACTEMENT ceci :
    const payload = {
      firstname,
      lastname,
      email,
      password,
    };

    const data = (await http("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    })) as any;

    const token = data?.accessToken ?? null;
    applyToken(token);

    const u: User = data?.user ??
    {
      id: String(data?.id ?? ""),
      email: String(data?.email ?? email),
      firstname: String(data?.firstname ?? firstname),
      lastname: String(data?.lastname ?? lastname),
    };

    setUser(u);
  };

  const logout = async () => {
    try {
      await http("/auth/logout", { method: "POST" });
    } catch {}
    applyToken(null);
    setUser(null);
  };

  // pas encore de refresh
  const ensureFresh = async () => {};

  const value = useMemo<AuthState>(
    () => ({
      user,
      accessToken,
      loading,
      login,
      register,
      logout,
      ensureFresh,
    }),
    [user, accessToken, loading]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
