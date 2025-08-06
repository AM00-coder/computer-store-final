import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../../service/products.service';
import { Route, Router } from '@angular/router';


@Component({
  selector: 'app-add-product',
  imports: [ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  addProductForm !: FormGroup; 
  selectedImage!: string;
constructor(private formBuilder: FormBuilder, private productsService: ProductsService,private router: Router){
  this.addProductForm = this.formBuilder.group({
    name : ['', Validators.required],
    price : ['', Validators.required],
    image : ['', Validators.required],
    description : ['', Validators.required],
    category  : ['', Validators.required],
    isPopular  : ['', Validators.required]

  }
  );
}
onfileSelceted(event: any){
  let file = event.target.files[0]
  if(file){
    let reader = new FileReader();
    reader.onload=(e: any) => {
      this.selectedImage = e.target.result;   
    }
    reader.readAsDataURL(file);
  }

  
}
add(){
  let name = this.addProductForm.value.name;
  let price = this.addProductForm.value.price;
  // let image = this.onfileSelceted(this.addProductForm.value.image)
  let description = this.addProductForm.value.description;
  let category = this.addProductForm.value.category;
  let isPopular = this.addProductForm.value.isPopular;
  this.productsService.add(name,price,this.selectedImage,description,category,isPopular);
  alert("yay")
  this.router.navigateByUrl('manageProduct')
//this.addProductForm.reset()
}

}
