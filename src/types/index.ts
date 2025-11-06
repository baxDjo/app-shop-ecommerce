export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;      // en cents pour éviter les flottants
  rating: number;     // 0..5
  stock: number;
  image: string;
  description: string;
  specs?: Record<string, string>;
  tags?: string[];
};

export type CartItem = {
  productId: string;
  qty: number;
};

export type Order = {
  id: string;
  createdAt: string;
  items: Array<{ product: Product; qty: number; lineTotal: number }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingInfo: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    email: string;
  };
};
