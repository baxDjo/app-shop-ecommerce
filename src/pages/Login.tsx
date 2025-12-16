import { type FormEvent, useState } from "react";
import { useAuth } from "../features/auth/AuthContext";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [sp] = useSearchParams();

  const [err, setErr] = useState<string | null>(null);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    try {
      await login(email, password);
      navigate("/checkout", { replace: true });
    } catch (e: any) {
      setErr(e?.message || "Échec de connexion.");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <h2>Connexion</h2>
      {err && <p className="notice" style={{ background: "#fee2e2", borderColor: "#fecaca" }}>{err}</p>}
      <form onSubmit={onSubmit} className="form">
        <label>Email <input name="email" type="email" required /></label>
        <label>Mot de passe <input name="password" type="password" required /></label>
        <button className="btn" type="submit">Se connecter</button>
      </form>
      <p className="muted" style={{ marginTop: 8 }}>
        Pas de compte ? <Link className="link" to="/register">Créer un compte</Link>
      </p>
    </div>
  );
}
