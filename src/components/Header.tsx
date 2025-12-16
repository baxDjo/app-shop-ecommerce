import { Link, NavLink } from "react-router-dom";
import { useStore } from "../app/store";

export default function Header() {
  const itemsCount = useStore((s) => s.items.reduce((a, b) => a + b.qty, 0));
  return (
    <header className="container">
      <div className="nav">
        <Link to="/" className="logo">MyShop</Link>
        <nav className="nav-links">
          <NavLink to="/products">Catalogue</NavLink>
          <NavLink to="/orders">Commandes</NavLink>
        </nav>
        <NavLink to="/Login" className="cart-link">🛒 {itemsCount}</NavLink>
      </div>
    </header>
  );
}
