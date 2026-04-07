// src/components/Header.tsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useStore } from "../app/store";
import { useAuth } from "../features/auth/AuthContext";

export default function Header() {
  const itemsCount = useStore((s) => s.items.reduce((a, b) => a + b.qty, 0));
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true }); // ou "/" si tu préfères
  };

  return (
    <header className="container">
      <div className="nav">
        <Link to="/" className="logo">MyShop</Link>

        <nav className="nav-links">
          <NavLink to="/products">Catalogue</NavLink>
          <NavLink to="/orders">Commandes</NavLink>
        </nav>

        <NavLink to="/cart" className="cart-link">🛒 {itemsCount}</NavLink>

        {user ? (
          <>
            <NavLink to="/account" style={{ marginLeft: 12 }}>
              {user.firstname} {user.lastname}
            </NavLink>
            <button className="btn btn-sm" onClick={handleLogout} style={{ marginLeft: 8 }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" style={{ marginLeft: 12 }}>Login</NavLink>
            <NavLink to="/register" style={{ marginLeft: 8 }}>Register</NavLink>
          </>
        )}
      </div>
    </header>
  );
}
