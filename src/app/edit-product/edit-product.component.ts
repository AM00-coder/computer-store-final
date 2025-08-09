import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../service/products.service';
import { Product } from '@models/product';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class EditProductComponent implements OnInit {
  editProductForm!: FormGroup;
  selectedImageUrl: string = '';
  product: any;

  constructor(
    private fb: FormBuilder,
    private productService: ProductsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.editProductForm = this.fb.group({
      _id: [''], // keep enabled to send it to backend
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      image: [''],
      description: ['', Validators.required],
      category: ['', Validators.required],
      isPopular: [false, Validators.required], // use boolean not string
    });

    const _id = this.route.snapshot.paramMap.get('id');
    if (_id) {
      this.productService.getProductById(_id).subscribe((product) => {
        if (product) {
          this.editProductForm.patchValue(product);
          this.selectedImageUrl = product.image;
        } else {
          console.error("❌ Product not found for ID:", _id);
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImageUrl = reader.result as string;
        this.editProductForm.patchValue({ image: this.selectedImageUrl });
      };
      reader.readAsDataURL(file);
    }
  }

  edit(): void {
    if (this.editProductForm.invalid) {
      alert("Form is invalid!");
      return;
    }

    const formValues = this.editProductForm.getRawValue();

    if (!formValues._id) {
      console.error("❌ No _id found! Cannot update product.");
      return;
    }

    // If image is empty and we had one before, reuse it
    if (!formValues.image && this.selectedImageUrl) {
      formValues.image = this.selectedImageUrl;
    }

    const updatedProduct: Product = {
      _id: formValues._id,
      name: formValues.name,
      price: formValues.price,
      image: formValues.image,
      description: formValues.description,
      category: formValues.category,
      isPopular: formValues.isPopular,
      quantity:formValues.quantity
    };

    console.log("🟡 ID to update:", updatedProduct._id);
    console.log("📤 Sending to backend:", updatedProduct);

    this.productService.update(updatedProduct).subscribe({
      next: () => {
        alert("✅ Product updated!");
        this.router.navigate(['/manageProduct']); // optional redirect
      },
      error: (err) => {
        console.error("❌ Error updating product:", err);
      }
    });
  }
}
