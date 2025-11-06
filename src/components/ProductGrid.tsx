import { useFilteredProducts } from "../app/store";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const products = useFilteredProducts();
  if (!products.length) return <p>Aucun produit ne correspond à votre recherche.</p>;
  return (
    <section className="grid">
      {products.map((p) => <ProductCard key={p.id} p={p} />)}
    </section>
  );
}
