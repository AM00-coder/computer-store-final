import { Component } from '@angular/core';
import { Product } from '../models/product';
import { ProductsService } from '../../service/products.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-products',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './manage-products.component.html',
  styleUrl: './manage-products.component.css'
})
export class ManageProductsComponent {
  products: Product[] = [];
  searchForm!: FormGroup;
  productForm!: FormGroup;
  selectedImageUrl: string = ''; // For previewing uploaded image

  constructor(
    private productService: ProductsService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    // Load products
    setTimeout(() => {
      this.products = this.productService.getAllProducts();
    }, 10);

    // Search form
    this.searchForm = this.formBuilder.group({
      price: ['', Validators.required]
    });

    // Add product form
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      image: [''], // Image will be set via onImageSelected()
      description: [''],
      category: [''],
      isPopular: [false]
    });
  }

  // 🔍 Filter products by price
  search() {
    const price = this.searchForm.value.price;
    if (price == null) this.clear();
    else this.products = this.productService.getbyPrice(price);
  }

  // 🔁 Reset search form
  clear() {
    this.searchForm.reset();
    this.products = this.productService.getAllProducts();
  }

  // 🖼️ Handle image upload and convert to Base64
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImageUrl = reader.result as string;
        this.productForm.patchValue({ image: this.selectedImageUrl }); // ✅ Inject into form
      };
      reader.readAsDataURL(file);
    }
  }

  // ➕ Add product
  submitProduct() {
  const { name, price, image, description, category, isPopular } = this.productForm.value;

  // 💣 If image field is still empty, stop
  if (!image) {
    alert('Please upload an image before adding the product!');
    return;
  }

  this.productService.add(name, price, image, description, category, isPopular);

  setTimeout(() => {
    this.products = this.productService.getAllProducts(); // Refresh list
    this.productForm.reset();
    this.selectedImageUrl = '';
  }, 200);
}

}
