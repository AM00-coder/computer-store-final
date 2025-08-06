import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../service/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  constructor(private fb: FormBuilder, private usersService: UsersService,private router: Router){
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      mail: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      avatar: ['']
    });
  }
  /**
   * Register a new user
   */
  onRegister() {
    if (this.registerForm.invalid) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    const { name, mail, password, birthDate, gender,isAdmin, avatar } = this.registerForm.value;

    const message = this.usersService.register(
      name,
      mail,
      password,
      new Date(birthDate),
      gender
    );

    alert(message);

    if (message === 'User registered successfully!') {
      this.registerForm.reset();
      this.router.navigate(['/profile']); // Redirect to the login page
    }
  }
}
