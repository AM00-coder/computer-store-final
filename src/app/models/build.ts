export interface BuildItem {
  productId: string;            // populated on backend, string here
  quantity: number;
  priceAtAdd?: number;
  // optional helper for UI
  product?: {
    _id: string;
    name: string;
    price: number;
    image: string;
    category: string;
  };
}

export interface Build {
  _id?: string;
  userId: string;
  name: string;
  items: BuildItem[];
  totalPrice: number;
  isPaid: boolean;
  createdAt?: string;
  updatedAt?: string;
}
