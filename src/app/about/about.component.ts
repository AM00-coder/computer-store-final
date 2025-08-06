import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  imports : [NgFor],
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  isBlackBackground = false;
admins=[
{name:"Haitham",Id:"32092147",image:"assets/Haitham.jpg"},{name:"Ayham",Id:"322471228",image:"assets/Ayham.jpg"}
]
  // Toggle the background color and text color for both the body and member divs
  toggleBackground(): void {
    this.isBlackBackground = !this.isBlackBackground;
  }
}
