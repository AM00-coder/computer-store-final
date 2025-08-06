import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../service/users.service';
import { User } from '../models/user';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-user-details',
  imports:[NgIf],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  loggedInUser: User | null = null;
  bDate : string = ''
  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loggedInUser = this.usersService.getLoggedInUser();
    if (this.loggedInUser && typeof this.loggedInUser.birthDate === 'string') {
      this.loggedInUser.birthDate = new Date(this.loggedInUser.birthDate);
      this.bDate =  this.loggedInUser.birthDate.getDate() + '-' + this.loggedInUser.birthDate.getMonth()+
      "-"+this.loggedInUser.birthDate.getFullYear()
    }
  }
}