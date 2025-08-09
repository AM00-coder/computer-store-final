import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { ProductsComponent } from "../products/products.component";
import { Product } from '../models/product';
import { ProductsService } from '../../service/products.service';
import { User } from '@models/user';
import { UsersService } from 'src/service/users.service';
import { CartService } from 'src/service/cart.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
  imports: [SidebarComponent, ProductsComponent]
})
export class CatalogComponent {
  products: Product[] | undefined;
 // userService: any;

  constructor(
    private productService: ProductsService,
    private cartService: CartService,
    private userService: UsersService
  ) {
    this.products = productService.getAllProducts();
  }

  selectedCategory: string = 'All'; // Default to show all products

  // Method to receive the selected category from the sidebar
  onCategorySelected(category: string): void {
    this.selectedCategory = category;
  }

  // ✅ Add product to cart
addToCart(product: Product): void {
  const user: User | null = this.userService.getLoggedInUser();

  if (!user || !user.email) {
    alert('⚠️ Please log in to add items to your cart.');
    return;
  }

  // 🔍 Fetch the latest version of the product from the server (to get latest quantity)
  this.productService.getProductById(product._id!).subscribe({
    next: (latestProduct) => {
      this.cartService.getCart().subscribe({
        next: (cart) => {
          const existingProduct = cart.products.find(
            (item: any) => item.productId === product._id
          );

          const alreadyInCartQty = existingProduct ? existingProduct.quantity : 0;

          if (alreadyInCartQty >= latestProduct.quantity) {
            alert('❌ Not enough stock available.');
            return;
          }

          // ✅ Safe to add
          this.cartService.addToCart(product._id!).subscribe({
            next: () => {
              alert(`✅ "${latestProduct.name}" has been added to your cart.`);
            },
            error: (err) => {
              console.error('❌ Error adding to cart:', err);
              alert('❌ Failed to add product to cart.');
            }
          });
        },
        error: (err) => {
          console.error('❌ Failed to get cart:', err);
          alert('❌ Could not retrieve cart.');
        }
      });
    },
    error: (err) => {
      console.error('❌ Failed to fetch product from server:', err);
      alert('❌ Could not check product stock.');
    }
  });
}
}
