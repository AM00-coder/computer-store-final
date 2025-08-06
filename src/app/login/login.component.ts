import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../service/users.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(private usersService: UsersService, private formBuilder: FormBuilder, private router:Router) {
    this.loginForm = this.formBuilder.group({
      mail: ['', Validators.compose([Validators.required, Validators.email])],
      pass: ['', [Validators.required]]
    });
  }

 onlogin() {
  const { mail, pass } = this.loginForm.value;
  this.usersService.login(mail, pass).subscribe({
    next: (user) => {
      this.usersService.storeUserLocally(user);
      alert(`Welcome, ${user.name}!`);
      this.router.navigateByUrl('userdetails');
    },
    error: () => {
      alert('Wrong email or password');
    }
  });
}



}
