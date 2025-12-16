import { useCartComputed, useStore } from "../app/store";
import { money } from "../utils/format";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { lines, subtotal, shipping, tax, total } = useCartComputed();
  const clearCart = useStore((s) => s.clearCart);
  const placeOrder = useStore((s) => s.placeOrder);
  const navigate = useNavigate();

  const handleOrder = () => {
    const order = placeOrder({
      items: lines,
      subtotal, shipping, tax, total,
    });
    clearCart();
    navigate(`/orders?created=${order.id}`);
  };

  if (lines.length === 0) return <div className="container"><p>Panier vide.</p></div>;

  return (
    <div className="container checkout">

      <aside className="summary">
        <h3>Récapitulatif</h3>

        <ul className="mini">
          {lines.map(({ product, qty, lineTotal }) => (
            <li key={product.id}>
              <span>{product.name} × {qty}</span>
              <strong>{money(lineTotal)}</strong>
            </li>
          ))}
        </ul>

        <div><span>Sous-total</span><strong>{money(subtotal)}</strong></div>
        <div><span>Livraison</span><strong>{shipping === 0 ? "Offerte" : money(shipping)}</strong></div>
        <div><span>TVA</span><strong>{money(tax)}</strong></div>

        <div className="total">
          <span>Total</span>
          <strong>{money(total)}</strong>
        </div>

        {/* bouton en bas */}
        <div className="summary-action">
          <button
            type="submit"
            className="btn btn-sm"
            onClick={handleOrder}
          >
            Confirmer la commande
          </button>
        </div>
      </aside>



    </div>

  );
}
