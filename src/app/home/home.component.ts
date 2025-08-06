import { NgFor } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { Product } from '../models/product';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../service/products.service';

@Component({
  selector: 'app-home',
  imports: [NgFor, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  {
  products: Product[] | undefined;

  constructor(private productService: ProductsService) {
    setTimeout(() => {
      this.products = productService.getPopularProducts();
    }, 10);
  }

 
}
