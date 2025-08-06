import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Cart } from "@models/cart";

@Injectable({ providedIn: 'root' })
export class CartService {
  private baseUrl = 'http://localhost:3000/cart';

  constructor(private http: HttpClient) {}

  private getUserId(): string {
    let userId = localStorage.getItem('userId');

    if (!userId) {
      const sessionUser = sessionStorage.getItem('loggedInUser');
      if (sessionUser) {
        const parsed = JSON.parse(sessionUser);
        userId = parsed._id || parsed.id;
        if (userId) {
          localStorage.setItem('userId', userId);
        }
      }
    }

    if (!userId) {
      console.error('❌ User ID missing!');
      throw new Error('User ID missing');
    }

    return userId;
  }

  // ✅ GET CART
  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.baseUrl}/${this.getUserId()}`);
  }

  // ✅ ADD product to cart
  addToCart(productId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/addProduct/${this.getUserId()}`, {
      productId,
      quantity: 1
    });
  }

  // ✅ DECREASE product quantity
  decreaseQuantity(productId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/addProduct/${this.getUserId()}`, {
      productId,
      quantity: -1
    });
  }

  // ✅ REMOVE product from cart
  removeFromCart(productId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/removeProduct/${this.getUserId()}`, {
      productId
    });
  }

  // ✅ PAY
  payCart(): Observable<any> {
    return this.http.put(`${this.baseUrl}/pay/${this.getUserId()}`, {});
  }
}
