import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { ProductsService } from '../../service/products.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from 'src/service/cart.service'; // If using cart
import { Output, EventEmitter } from '@angular/core';
import { BuildsService } from 'src/service/builds.service';

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
  @Output() addToCartClicked = new EventEmitter<Product>();

  

  constructor(private productService: ProductsService, private cartService: CartService,private buildsService: BuildsService) {}

  ngOnInit(): void {
    this.productService.initProducts().subscribe((data: Product[]) => {
      this.products = data;
      this.filteredProducts = [...this.products]; // By default show all
    });
  }
  latestBuildId?: string;
  addToBuild(product: Product) {
  // get or create a draft build, then add item
  const ensure = this.latestBuildId
    ? this.buildsService.get(this.latestBuildId)
    : this.buildsService.create();

  ensure.subscribe(b => {
    this.latestBuildId = b._id!;
    this.buildsService.addItem(b._id!, product._id!, 1).subscribe(() => {
      alert(`✅ Added "${product.name}" to "${b.name}"`);
    });
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
  this.addToCartClicked.emit(product); // Emit to parent
}
}
