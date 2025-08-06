import { CartItem } from "./cartItem";

export class Cart {
  _id?: string;
  userId?: string;
  products: { productId: string | any; quantity: number }[] = []; // From backend
  items: CartItem[] = []; // For frontend display
  isPaid: boolean = false;
  totalPrice: number = 0;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(init?: Partial<Cart>) {
    Object.assign(this, init);
  }
}
