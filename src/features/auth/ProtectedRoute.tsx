// src/routes/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";


export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) {
    return <div className="container"><p>Chargement…</p></div>;
  }

  if (!user) {
    const next = encodeURIComponent(loc.pathname + loc.search);
    return <Navigate to={`/register?next=${next}`} replace />;
    // si tu veux forcer register plutôt :
    // return <Navigate to={`/register?next=${next}`} replace />;
  }

  return <>{children}</>;
}
