import { Link } from "react-router-dom";
import { money } from "../utils/format";
import { useStore } from "../app/store";
import type { Product } from "../types";

export default function ProductCard({ p }: { p: Product }) {
  const addToCart = useStore((s) => s.addToCart);
  const wishlist = useStore((s) => s.wishlist);
  const toggleWishlist = useStore((s) => s.toggleWishlist);

  return (
    <article className="card">
      <Link to={`/products/${p.id}`} className="img-wrap">
        <img src={p.image} alt={p.name} loading="lazy" />
      </Link>
      <div className="card-body">
        <h3 className="title">
          <Link to={`/products/${p.id}`}>{p.name}</Link>
        </h3>
        <p className="muted">{p.brand} • {p.category}</p>
        <p className="price">{money(p.price)}</p>
        <div className="actions">
          <button onClick={() => addToCart(p.id)} disabled={p.stock === 0}>
            {p.stock === 0 ? "Rupture" : "Ajouter"}
          </button>
          <button
            aria-pressed={wishlist.includes(p.id)}
            className={wishlist.includes(p.id) ? "wish on" : "wish"}
            onClick={() => toggleWishlist(p.id)}
            title="Wishlist"
          >♥</button>
        </div>
      </div>
    </article>
  );
}
