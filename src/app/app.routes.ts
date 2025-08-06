import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CatalogComponent } from './catalog/catalog.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProductsComponent } from './products/products.component';
import { LoginComponent } from './login/login.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ManageProductsComponent } from './manage-products/manage-products.component';
import { RegisterComponent } from './register/register.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { CartComponent } from './cart/cart.component'; // 👈 אל תשכח להוסיף את זה

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'product-details/:id', component: ProductDetailsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'profile', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'manageProduct', component: ManageProductsComponent },
  { path: 'addProduct', component: AddProductComponent },
  { path: 'editProduct/:id', component: EditProductComponent },
  { path: 'userdetails', component: UserDetailsComponent },
  { path: 'cart', component: CartComponent },
  { path: '**', component: NotFoundComponent }
];
