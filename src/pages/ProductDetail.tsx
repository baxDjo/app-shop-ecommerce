import { useParams } from "react-router-dom";
import { useStore } from "../app/store";
import { money } from "../utils/format";
import QuantityInput from "../components/QuantityInput";
import { useState } from "react";

export default function ProductDetail() {
  const { id } = useParams();
  const product = useStore((s) => s.products.find((p) => p.id === id));
  const addToCart = useStore((s) => s.addToCart);
  const [qty, setQty] = useState(1);

  if (!product) return <div className="container"><p>Produit introuvable.</p></div>;

  return (
    <div className="container detail">
      <img src={product.image} alt={product.name} className="detail-img" />
      <div className="detail-body">
        <h2>{product.name}</h2>
        <p className="muted">{product.brand} • {product.category}</p>
        <p className="price">{money(product.price)}</p>
        <p>{product.description}</p>

        {product.specs && (
          <ul className="specs">
            {Object.entries(product.specs).map(([k,v]) => (
              <li key={k}><strong>{k}:</strong> {v}</li>
            ))}
          </ul>
        )}

        <QuantityInput value={qty} onChange={setQty} />
        <button onClick={() => addToCart(product.id, qty)} disabled={product.stock === 0}>
          {product.stock === 0 ? "Rupture" : "Ajouter au panier"}
        </button>
      </div>
    </div>
  );
}
