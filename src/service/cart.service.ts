import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Cart } from '@models/cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private baseUrl = 'http://localhost:3000/cart';

  // 🔴 Single source of truth for the cart in the UI
 cart$ = new BehaviorSubject<Cart>({
  userId: '',
  products: [],
  items: [], // ✅ match your Cart model
  totalPrice: 0,
  isPaid: false,
});


  constructor(private http: HttpClient) {}

  // ---------------------------
  //  Auth / user id helper
  // ---------------------------
  private getUserId(): string {
    let userId = localStorage.getItem('userId');

    if (!userId) {
      const sessionUser = sessionStorage.getItem('loggedInUser');
      if (sessionUser) {
        const parsed = JSON.parse(sessionUser);
        userId = parsed._id || parsed.id;
        if (userId) localStorage.setItem('userId', userId);
      }
    }

    if (!userId) {
      console.error('❌ User ID missing!');
      throw new Error('User ID missing');
    }

    return userId;
  }

  // ---------------------------
  //  Live cart helpers
  // ---------------------------
  /** Pull fresh cart from server and push into cart$ */
  refreshCartFromServer(): Observable<Cart> {
    const userId = this.getUserId();
    return this.http.get<Cart>(`${this.baseUrl}/${userId}`).pipe(
      tap(cart => this.cart$.next(cart))
    );
  }

  /** Manually replace the current cart in memory */
  setCart(cart: Cart): void {
    this.cart$.next(cart);
  }

  /** Clear cart locally (used after successful pay) */
  clearCartLocal(): void {
  const c = this.cart$.value;
  this.cart$.next({
    ...c,
    products: [],
    items: [], // ✅ clear items too
    totalPrice: 0,
    isPaid: true
  });
  localStorage.removeItem('cart');
}


  // ---------------------------
  //  CRUD-ish API calls
  // ---------------------------
  /** Get cart (raw call, not auto-pushing to cart$) */
  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.baseUrl}/${this.getUserId()}`);
  }

  /** Add +1 of a product to the cart */
  addToCart(productId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/addProduct/${this.getUserId()}`, {
      productId,
      quantity: 1,
    }).pipe(
      tap(() => this.refreshCartFromServer().subscribe())
    );
  }
  clearCart(userId?: string): Observable<any> {
    const id = userId ?? this.getUserId();
    return this.http.put(`${this.baseUrl}/${id}/clear`, {});
  }

  /** Decrease by 1 (backend should remove if reaches 0) */
  decreaseQuantity(productId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/addProduct/${this.getUserId()}`, {
      productId,
      quantity: -1,
    }).pipe(
      tap(() => this.refreshCartFromServer().subscribe())
    );
  }

  /** Remove product entirely */
  removeFromCart(productId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/removeProduct/${this.getUserId()}`, {
      productId,
    }).pipe(
      tap(() => this.refreshCartFromServer().subscribe())
    );
  }

  // ---------------------------
  //  Pay / checkout
  // ---------------------------
  /** Old alias if something still calls it */
  payCart(): Observable<any> {
    return this.markCartAsPaid(); // delegate
  }

  /** Mark as paid on the server, then clear locally */
  markCartAsPaid(): Observable<Cart | any> {
    const userId = this.getUserId();
    // ✅ Use the canonical backend route: /cart/pay/:userId
    return this.http.put<Cart>(`${this.baseUrl}/pay/${userId}`, {}).pipe(
      tap((serverCart) => {
        // If server returns updated cart use it, else clear locally
        if (serverCart && serverCart.products !== undefined) {
          this.cart$.next(serverCart);
        } else {
          this.clearCartLocal();
        }
      })
    );
  }
}
