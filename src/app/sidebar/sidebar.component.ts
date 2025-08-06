import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports:[],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
 
  // Event emitter to notify the parent component of the selected category
  @Output() categorySelected : EventEmitter<string> = new EventEmitter();


  // Method to emit the selected category
  selectCategory(category: string): void {
    // This will navigate to the product list filtered by the selected category
    this.categorySelected.emit(category)
  }
}
