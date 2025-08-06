import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { ProductsService } from '../../service/products.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from 'src/service/cart.service'; // If using cart

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  constructor(private productService: ProductsService, private cartService: CartService) {}

  ngOnInit(): void {
    this.productService.initProducts().subscribe((data: Product[]) => {
      this.products = data;
      this.filteredProducts = [...this.products]; // By default show all
    });
  }

  @Input() set filterProducts(category: string) {
    if (!this.products || this.products.length === 0) return;

    if (category === 'All') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product => product.category === category);
    }
  }

  addToCart(product: Product): void {
    if (!product._id) {
      console.error('❌ Product missing _id:', product);
      return;
    }
    this.cartService.addToCart(product._id).subscribe({
      next: () => console.log('✅ Product added to cart:', product.name),
      error: (err) => console.error('❌ Failed to add to cart:', err)
    });
  }
}
