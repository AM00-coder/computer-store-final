import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../service/users.service';

@Component({
  selector: 'app-navbar',
  imports:[RouterLink,NgIf],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
isAdmin: boolean = false;
  isLoggedIn: boolean=false;
constructor(private userService: UsersService,private router:Router){
  /**this.userService.isLoggedIn.subscribe(
    (status)=>(this.isLoggedIn=status)
  );**/
  this.router.events.subscribe(
    (data:any)=>{
      if(data.url){
        if(sessionStorage.getItem('loggedInUser')){
          this.isLoggedIn=true
          if(sessionStorage.getItem('admin')==='true')
            this.isAdmin=true
        }
      }
    }
  )
}
logout() {
  // Clear authentication data
  localStorage.removeItem('user'); // Remove user data
  localStorage.removeItem('token'); // Remove stored token
  sessionStorage.clear(); // Clear any session data

  // Update UI state
  this.isLoggedIn = false;
  this.isAdmin = false;

  // Notify other components that the user is logged out
  this.userService.isLoggedIn.next(false);

  // Redirect to login page
  this.router.navigate(['/profile']);
}
}
