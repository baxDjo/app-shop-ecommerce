import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { CartItem, Order, Product } from "../types";
import { PRODUCTS } from "../data/products";

// ---------- Types ----------
type State = {
  products: Product[];
  query: string;
  category: string | null;
  minPrice: number | null;
  maxPrice: number | null;

  items: CartItem[];
  wishlist: string[];

  orders: Order[];

  isCartOpen: boolean;
};

type Action =
  | { type: "SET_QUERY"; q: string }
  | { type: "SET_CATEGORY"; c: string | null }
  | { type: "SET_PRICE_RANGE"; min: number | null; max: number | null }
  | { type: "ADD_TO_CART"; productId: string; qty: number }
  | { type: "SET_QTY"; productId: string; qty: number }
  | { type: "REMOVE_FROM_CART"; productId: string }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_WISHLIST"; productId: string }
  | { type: "PLACE_ORDER"; order: Order }
  | { type: "SET_CART_OPEN"; value: boolean }
  | { type: "HYDRATE"; state: Partial<State> };

// ---------- Initial ----------
const initialState: State = {
  products: PRODUCTS,
  query: "",
  category: null,
  minPrice: null,
  maxPrice: null,

  items: [],
  wishlist: [],

  orders: [],

  isCartOpen: false,
};

// ---------- Reducer ----------
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_QUERY":
      return { ...state, query: action.q };
    case "SET_CATEGORY":
      return { ...state, category: action.c };
    case "SET_PRICE_RANGE":
      return { ...state, minPrice: action.min, maxPrice: action.max };

    case "ADD_TO_CART": {
      const items = state.items.map((i) => ({ ...i }));
      const found = items.find((i) => i.productId === action.productId);
      if (found) found.qty += action.qty;
      else items.push({ productId: action.productId, qty: action.qty });
      return { ...state, items };
    }

    case "SET_QTY": {
      const items = state.items
        .map((i) =>
          i.productId === action.productId ? { ...i, qty: action.qty } : i
        )
        .filter((i) => i.qty > 0);
      return { ...state, items };
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter((i) => i.productId !== action.productId),
      };

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "TOGGLE_WISHLIST": {
      const set = new Set(state.wishlist);
      set.has(action.productId)
        ? set.delete(action.productId)
        : set.add(action.productId);
      return { ...state, wishlist: [...set] };
    }

    case "PLACE_ORDER":
      return { ...state, orders: [action.order, ...state.orders] };

    case "SET_CART_OPEN":
      return { ...state, isCartOpen: action.value };

    case "HYDRATE":
      return { ...state, ...action.state };

    default:
      return state;
  }
}

// ---------- Context ----------
type Ctx = State & {
  setQuery: (q: string) => void;
  setCategory: (c: string | null) => void;
  setPriceRange: (min: number | null, max: number | null) => void;

  addToCart: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;

  placeOrder: (payload: Omit<Order, "id" | "createdAt">) => Order;

  setCartOpen: (v: boolean) => void;
};

const StoreContext = createContext<Ctx | null>(null);
const LS_KEY = "shop-state";

// ---------- Provider ----------
export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<State>;
        dispatch({
          type: "HYDRATE",
          state: { ...parsed, products: PRODUCTS },
        });
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Persist
  useEffect(() => {
    const { products, ...persistable } = state;
    localStorage.setItem(LS_KEY, JSON.stringify(persistable));
  }, [state]);

  // API exposée
  const api: Ctx = useMemo(
    () => ({
      ...state,

      setQuery: (q) => dispatch({ type: "SET_QUERY", q }),
      setCategory: (c) => dispatch({ type: "SET_CATEGORY", c }),
      setPriceRange: (min, max) =>
        dispatch({ type: "SET_PRICE_RANGE", min, max }),

      addToCart: (productId, qty = 1) =>
        dispatch({ type: "ADD_TO_CART", productId, qty }),
      setQty: (productId, qty) =>
        dispatch({ type: "SET_QTY", productId, qty }),
      removeFromCart: (productId) =>
        dispatch({ type: "REMOVE_FROM_CART", productId }),
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
      toggleWishlist: (productId) =>
        dispatch({ type: "TOGGLE_WISHLIST", productId }),

      placeOrder: (payload) => {
        const order: Order = {
          ...payload,
          id: `ord_${Math.random().toString(36).slice(2, 8)}`,
          createdAt: new Date().toISOString(),
        };
        dispatch({ type: "PLACE_ORDER", order });
        return order;
      },

      setCartOpen: (v) => dispatch({ type: "SET_CART_OPEN", value: v }),
    }),
    [state]
  );

  // ⚙️ Pas de JSX ici :
  return React.createElement(StoreContext.Provider, { value: api }, children);
}

// ---------- Hooks ----------
export function useStore<T>(selector: (s: Ctx) => T): T {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return selector(ctx);
}

// ---------- Sélecteurs ----------
export const useFilteredProducts = () =>
  useStore((s) =>
    s.products.filter((p) => {
      const q = s.query.trim().toLowerCase();
      const okQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q));
      const okCat = !s.category || p.category === s.category;
      const okMin = s.minPrice == null || p.price >= s.minPrice;
      const okMax = s.maxPrice == null || p.price <= s.maxPrice;
      return okQ && okCat && okMin && okMax;
    })
  );

export const useCartComputed = () =>
  useStore((s) => {
    const lines = s.items.map((it) => {
      const product = s.products.find((p) => p.id === it.productId)!;
      const lineTotal = product.price * it.qty;
      return { product, qty: it.qty, lineTotal };
    });
    const subtotal = lines.reduce((a, b) => a + b.lineTotal, 0);
    const shipping = subtotal > 100_00 ? 0 : 8_99;
    const tax = Math.round(subtotal * 0.2);
    const total = subtotal + shipping + tax;
    return { lines, subtotal, shipping, tax, total };
  });
