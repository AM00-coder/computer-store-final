import { Injectable } from '@angular/core';
import { User } from '../app/models/user';

@Injectable({
  providedIn: 'root' // Ensures it's globally available
})
export class AuthService {
  private user: User | null = null; // Store user state

  constructor() {}

  login(email: string, password: string): User | null {
    // Simulated authentication (Replace with real authentication logic)
    if (email === 'admin@example.com' && password === 'admin123') {
      this.user = new User(
        1,
        'Admin User',
        email,
        password,
        new Date('1985-01-01'),
        'Male',
        'assets/admin-avatar.jpg',
        true // Admin user
      );
    } else if (email === 'user@example.com' && password === 'user123') {
      this.user = new User(
        2,
        'Regular User',
        email,
        password,
        new Date('1995-06-15'),
        'Female',
        'assets/user-avatar.jpg',
        false // Regular user
      );
    } else {
      return null; // Invalid credentials
    }

    return this.user;
  }

  logout(): void {
    this.user = null; // Clear user session
  }

  getUser(): User | null {
    return this.user; // Retrieve logged-in user
  }
}
