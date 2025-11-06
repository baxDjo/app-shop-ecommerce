import { useStore } from "../app/store";

export default function SearchBar() {
  const query = useStore((s) => s.query);
  const setQuery = useStore((s) => s.setQuery);
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Rechercher (produit, marque, tag…) "
      aria-label="Recherche"
      className="input"
    />
  );
}
