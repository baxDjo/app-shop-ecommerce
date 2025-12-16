import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="container hero">
      <h1>Bienvenue sur MyShop</h1>
      <p className="muted">Boutique démo ecommerce — sans paiement.</p>
      <Link className="btn" to="/products">Voir le catalogue</Link>
    </section>
  );
}
