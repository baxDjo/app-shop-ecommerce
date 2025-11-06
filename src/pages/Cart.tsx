import { Link } from "react-router-dom";
import { money } from "../utils/format";
import { useCartComputed, useStore } from "../app/store";
import QuantityInput from "../components/QuantityInput";

export default function Cart() {
  const { lines, subtotal, shipping, tax, total } = useCartComputed();
  const setQty = useStore((s) => s.setQty);
  const removeFromCart = useStore((s) => s.removeFromCart);

  if (lines.length === 0)
    return (
      <div className="container">
        <p>Votre panier est vide.</p>
        <Link to="/products" className="btn">Continuer mes achats</Link>
      </div>
    );

  return (
    <div className="container cart">
      <ul className="cart-list">
        {lines.map(({ product, qty, lineTotal }) => (
          <li key={product.id} className="cart-item">
            <img src={product.image} alt="" />
            <div className="grow">
              <h3>{product.name}</h3>
              <p className="muted">{product.brand}</p>
              <button className="link" onClick={() => removeFromCart(product.id)}>Retirer</button>
            </div>
            <QuantityInput value={qty} onChange={(v) => setQty(product.id, v)} />
            <div className="line-total">{money(lineTotal)}</div>
          </li>
        ))}
      </ul>

      <aside className="summary">
        <div><span>Sous-total</span><strong>{money(subtotal)}</strong></div>
        <div><span>Livraison</span><strong>{shipping === 0 ? "Offerte" : money(shipping)}</strong></div>
        <div><span>TVA (20%)</span><strong>{money(tax)}</strong></div>
        <div className="total"><span>Total</span><strong>{money(total)}</strong></div>
        <Link to="/checkout" className="btn">Passer au checkout</Link>
      </aside>
    </div>
  );
}
