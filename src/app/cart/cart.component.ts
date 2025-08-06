import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, JsonPipe } from '@angular/common'; // ✅ Add JsonPipe here
import { CartService } from 'src/service/cart.service';
import { Cart } from '@models/cart';
import { CartItem } from '@models/cartItem';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [NgIf, NgFor] 
})
export class CartComponent implements OnInit {
  cart: Cart = new Cart();

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (data) => {
        console.log('✅ Cart from backend:', data);
        this.cart = new Cart(data);

        if (Array.isArray(data.products)) {
          this.cart.items = data.products.map((p: any) => {
            if (!p || !p.productId) {
              console.warn("⚠️ Missing productId in:", p);
              return null;
            }

            return {
              productId: p.productId._id || '',
              name: p.productId.name || 'Unknown',
              price: p.productId.price || 0,
              quantity: p.quantity || 1,
              image: p.productId.image || ''
            };
          }).filter(item => item !== null);
        } else {
          this.cart.items = [];
        }

        this.cart.totalPrice = this.cart.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        console.log('✅ Final cart.items:', this.cart.items);
      },
      error: (err) => console.error('❌ Failed to load cart:', err)
    });
  }

  increase(id: string) {
    this.cartService.addToCart(id).subscribe(() => this.loadCart());
  }

  decrease(id: string) {
    this.cartService.decreaseQuantity(id).subscribe(() => this.loadCart());
  }

  remove(id: string) {
    this.cartService.removeFromCart(id).subscribe(() => this.loadCart());
  }

  clearCart() {
    for (const item of this.cart.items) {
      this.remove(item.productId);
    }
  }

  pay() {
    this.cartService.payCart().subscribe(() => this.loadCart());
  }
}
