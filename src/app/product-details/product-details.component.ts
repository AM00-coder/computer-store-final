import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../service/products.service';
import { Product } from '../../app/models/product';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  product: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService
  ) {
    const _id = this.route.snapshot.paramMap.get('_id');
    if (_id) {
      this.productService.getProductById(_id).subscribe((product: Product) => {
  this.product = product;
});
    }
  }
}
