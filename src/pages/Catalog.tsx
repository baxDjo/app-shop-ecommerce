import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import ProductGrid from "../components/ProductGrid";

export default function Catalog() {
  return (
    <div className="container">
      <div className="toolbar">
        <SearchBar />
        <Filters />
      </div>
      <ProductGrid />
    </div>
  );
}
