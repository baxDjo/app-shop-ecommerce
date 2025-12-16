// src/pages/Register.tsx
import { type FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);

    const firstname = String(fd.get("firstname") || "");
    const lastname = String(fd.get("lastname") || "");
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");

    try {
      await register(email, password, firstname, lastname);

      // ⬅️ redirection après succès
      navigate("/cart", { replace: true });
    } catch (e: any) {
      console.error(e);
      setErr(e?.message || "Échec de l'inscription.");
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <h2>Créer un compte</h2>

      {err && (
        <p className="notice" style={{ background: "#fee2e2", borderColor: "#fecaca" }}>
          {err}
        </p>
      )}

      <form onSubmit={onSubmit} className="form">
        <label>
          Prénom
          <input name="firstname" required />
        </label>

        <label>
          Nom
          <input name="lastname" required />
        </label>

        <label>
          Email
          <input name="email" type="email" required />
        </label>

        <label>
          Mot de passe
          <input name="password" type="password" required />
        </label>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Création du compte..." : "S'inscrire"}
        </button>
      </form>

      <p className="muted" style={{ marginTop: 8 }}>
        Déjà inscrit ? <Link className="link" to="/login">Se connecter</Link>
      </p>

      <p>Already have an account</p>
    </div>
  );
}
