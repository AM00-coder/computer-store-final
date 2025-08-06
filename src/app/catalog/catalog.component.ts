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
  userService: any;

  constructor(
    private productService: ProductsService,
    private cartService: CartService
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
    const user: User | null = this.userService.getCurrentUser();
    if (!user || !user.email) {
      alert('Please log in to add items to your cart.');
      return;
    }
  
}
}