import { useLocation } from "react-router-dom";
import { useStore } from "../app/store";
import { money } from "../utils/format";

export default function Orders() {
  const orders = useStore((s) => s.orders);
  const createdId = new URLSearchParams(useLocation().search).get("created");

  return (
    <div className="container">
      <h2>Mes commandes</h2>
      {createdId && <p className="notice">✅ Commande <strong>{createdId}</strong> créée.</p>}
      {!orders.length ? (
        <p>Aucune commande pour l’instant.</p>
      ) : (
        <ul className="orders">
          {orders.map((o) => (
            <li key={o.id} className="order">
              <div className="order-head">
                <strong>Commande {o.id}</strong>
                <span>{new Date(o.createdAt).toLocaleString("fr-FR")}</span>
              </div>
              <ul className="mini">
                {o.items.map(({ product, qty, lineTotal }) => (
                  <li key={product.id}>
                    <span>{product.name} × {qty}</span>
                    <strong>{money(lineTotal)}</strong>
                  </li>
                ))}
              </ul>
              <div className="total"><span>Total</span><strong>{money(o.total)}</strong></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
