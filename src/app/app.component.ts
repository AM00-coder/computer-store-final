import { Component } from '@angular/core';
import { NavbarComponent } from "./navbar/navbar.component";
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./footer/footer.component";  

@Component({
  selector: 'app-root',
  standalone: true, // ✅ this is required for imports to work
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [FooterComponent, RouterOutlet, NavbarComponent]
})
export class AppComponent {
  title = 'Hello LPJ';
}
