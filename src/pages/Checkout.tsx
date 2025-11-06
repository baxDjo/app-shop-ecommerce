import {type FormEvent } from "react";
import { useCartComputed, useStore } from "../app/store";
import { money } from "../utils/format";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { lines, subtotal, shipping, tax, total } = useCartComputed();
  const clearCart = useStore((s) => s.clearCart);
  const placeOrder = useStore((s) => s.placeOrder);
  const navigate = useNavigate();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const shippingInfo = {
      firstName: String(fd.get("firstName") || ""),
      lastName: String(fd.get("lastName") || ""),
      address: String(fd.get("address") || ""),
      city: String(fd.get("city") || ""),
      country: String(fd.get("country") || ""),
      email: String(fd.get("email") || "")
    };
    const order = placeOrder({
      items: lines,
      subtotal, shipping, tax, total,
      shippingInfo
    });
    clearCart();
    navigate(`/orders?created=${order.id}`);
  };

  if (lines.length === 0) return <div className="container"><p>Panier vide.</p></div>;

  return (
    <div className="container checkout">
      <form onSubmit={onSubmit} className="form">
        <h2>Informations de livraison</h2>
        <div className="grid2">
          <label>Prénom<input name="firstName" required /></label>
          <label>Nom<input name="lastName" required /></label>
        </div>
        <label>Adresse<input name="address" required /></label>
        <div className="grid2">
          <label>Ville<input name="city" required /></label>
          <label>Pays<input name="country" required /></label>
        </div>
        <label>Email<input type="email" name="email" required /></label>

        <button type="submit" className="btn">Confirmer la commande</button>
      </form>

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
        <div className="total"><span>Total</span><strong>{money(total)}</strong></div>
      </aside>
    </div>
  );
}
