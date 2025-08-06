import { Component } from '@angular/core';
import { LoginComponent } from "../login/login.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [LoginComponent, RouterOutlet],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

}
