import { Injectable } from '@angular/core';
import { User } from '../app/models/user';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  isLoggedIn = new BehaviorSubject<boolean>(false);
  url: string = 'http://localhost:3000/users';
  headers = { 'content-type': 'application/json' };
  users: User[] = [];

  constructor(private http: HttpClient, private router: Router) {
    this.refresh();
  }

  refresh() {
    this.initUsers().subscribe((data) => (this.users = data));
  }

  initUsers(): Observable<any> {
    return this.http.get(this.url);
  }

  insert(user: User) {
    let body = JSON.stringify(user);
    return this.http.post(`${this.url}/register`, body, { headers: this.headers });
  }

  // ✅ REGISTER new user
  register(name: string, mail: string, password: string, birthDate: Date, gender: string) {
    const existingUser = this.users.find(user => user.email === mail);
    if (existingUser) {
      return 'Email is already registered.';
    }

    const newUser = new User(name, mail, password, birthDate, gender, false);

    this.insert(newUser).subscribe(() => {
      this.refresh();
      console.log('Registered new user:', newUser);
    });

    return 'User registered successfully!';
  }

  // ✅ LOGIN - Real backend
  login(mail: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.url}/login`, { mail, password });
  }

  // ✅ STORE LOGGED-IN USER (call this in login.component.ts)
  storeUserLocally(user: User) {
    sessionStorage.setItem('loggedInUser', JSON.stringify(user));
    sessionStorage.setItem('admin', JSON.stringify(user.isAdmin));
    localStorage.setItem('userId', user._id || ''); // Required for cart!
    this.isLoggedIn.next(true);
  }

  // ✅ LOGOUT
  logout() {
    localStorage.removeItem('userId');
    sessionStorage.clear();
    this.isLoggedIn.next(false);
    this.router.navigate(['/profile']);
  }

  // ✅ GET CURRENT USER
  getLoggedInUser(): User | null {
    const user = sessionStorage.getItem('loggedInUser');
    return user ? JSON.parse(user) : null;
  }

  // ✅ GET BY EMAIL (optional)
  getUserByEmail(mail: string): User | null {
    const user = this.users.find(user => user.email === mail);
    return user || null;
  }
}
