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
  register: (email: string, password: string, firstname: string, lastname: string) => Promise<void>;
  logout: () => Promise<void>;
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

    const u: User = data?.user ?? {
      id: String(data?.id ?? ""),
      email: String(data?.email ?? email),
      firstname: String(data?.firstname ?? ""),
      lastname: String(data?.lastname ?? ""),
    };
    setUser(u);
  };

  const register = async (email: string, password: string, firstname: string, lastname: string) => {
    const payload = { firstname, lastname, email, password };

    const data = (await http("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    })) as any;

    const token = data?.accessToken ?? null;
    applyToken(token);

    const u: User = data?.user ?? {
      id: String(data?.id ?? ""),
      email: String(data?.email ?? email),
      firstname,
      lastname,
    };
    setUser(u);
  };

  // ✅ LOGOUT COMPLET
  const logout = async () => {
    // 1) appelle le backend (si présent) pour clear refresh cookie / session
    try {
      await http("/auth/logout", { method: "POST" });
    } catch {
      // si le backend n'a pas cette route ou renvoie une erreur, on logout quand même côté front
    }

    // 2) clear front state
    applyToken(null);
    setUser(null);
  };

  const value = useMemo<AuthState>(
    () => ({ user, accessToken, loading, login, register, logout }),
    [user, accessToken, loading]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
