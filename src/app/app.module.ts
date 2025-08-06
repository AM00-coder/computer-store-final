import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // ✅ Import these
import { CommonModule } from '@angular/common';                    // ✅ Also this
import { AppComponent } from './app.component';
import { EditProductComponent } from './edit-product/edit-product.component'; // ✅ Import the component

@NgModule({
  declarations: [
    AppComponent,
    EditProductComponent // ✅ Declare your component here
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule // ✅ For *ngIf, *ngFor etc.
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
