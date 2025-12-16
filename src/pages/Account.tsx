import { useAuth } from "../features/auth/AuthContext";

export default function Account() {
  const { user, logout } = useAuth();
  return (
    <div className="container">
      <h2>Mon compte</h2>
      {user ? (
        <>
          <p><strong>{user.name || user.email}</strong></p>
          <p className="muted">{user.email}</p>
          <button className="btn" onClick={logout}>Se déconnecter</button>
        </>
      ) : (
        <p>Non connecté.</p>
      )}
    </div>
  );
}
