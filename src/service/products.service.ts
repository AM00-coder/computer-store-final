import { Injectable } from '@angular/core';
import { Product } from '../app/models/product';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private url: string = 'http://localhost:3000/products';
  private headers = { 'content-type': 'application/json' };
  products: Product[] = [];

  constructor(private http: HttpClient) {
    this.refresh();
  }

  // ✅ Refresh local products array from backend
  refresh(): void {
    this.initProducts().subscribe((data) => (this.products = data));
  }

  // ✅ Get all products from backend
  initProducts(): Observable<any> {
    return this.http.get(this.url);
  }

  // ✅ POST a new product to backend
  insert(product: Product): Observable<any> {
    const body = JSON.stringify(product);
    return this.http.post(this.url, body, { headers: this.headers });
  }

  // ✅ Local-only getters/filters
  getAllProducts(): Product[] {
    return this.products;
  }

  getbyPrice(price: number): Product[] {
    return this.products.filter((a) => a.price <= price);
  }

  getPopularProducts(): Product[] {
    return this.products.filter((product) => product.isPopular === true);
  }

  getProductsByCategory(category: string): Product[] {
    return this.products.filter((product) => product.category === category);
  }

  getProductById(id: string): Observable<Product> {
  return this.http.get<Product>(`http://localhost:3000/products/${id}`);
}
  // ✅ Add new product
  add(
    name: string,
    price: number,
    image: string,
    description: string,
    category: string,
    isPopular: boolean,
    quantity: number
  ): void {
    const product = new Product(name, price, image, description, category, isPopular, quantity);
    this.insert(product).subscribe((response: any) => {
      if (response && response._id) {
        product._id = response._id;
        this.products.push(product);
        console.log('✅ Product saved and added:', product);
      } else {
        console.error('❌ Failed to get _id from backend');
      }
    });
  }

  // ✅ Update product in MongoDB
update(product: Product): Observable<any> {
  return this.http.put(`http://localhost:3000/products/${product._id}`, product);
}
  // ✅ Update product in local memory
  updateProduct(updatedProduct: Product): void {
    const index = this.products.findIndex(p => p._id === updatedProduct._id);
    if (index !== -1) {
      this.products[index] = updatedProduct;
    }
  }
  deleteProduct(id: string) {
  return this.http.delete(`http://localhost:3000/products/${id}`);
}

  
}
