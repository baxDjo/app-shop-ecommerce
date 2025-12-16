import { useStore } from "../app/store";

const categories = ["Vélos", "Équipements"];

export default function Filters() {
  const { category, setCategory, setPriceRange } = useStore((s) => ({
    category: s.category,
    setCategory: s.setCategory,
    setPriceRange: s.setPriceRange
  }));

  return (
    <div className="filters">
      <select
        value={category ?? ""}
        onChange={(e) => setCategory(e.target.value || null)}
        aria-label="Filtrer par catégorie"
      >
        <option value="">Toutes catégories</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <div className="price">
        <input
          type="number"
          min={0}
          placeholder="Min $"
          onChange={(e) =>
            setPriceRange(e.target.value ? Number(e.target.value) * 100 : null, null)
          }
        />
        <input
          type="number"
          min={0}
          placeholder="Max $"
          onChange={(e) =>
            setPriceRange(null, e.target.value ? Number(e.target.value) * 100 : null)
          }
        />
      </div>
    </div>
  );
}
