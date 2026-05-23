import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User, LoginRequest, RegisterRequest, UpdateProfileRequest } from '../_models/user.model';
import { environment } from '../../environments/environment';

/**
 * AccountService manages the authentication state for the entire app.
 *
 * WHY signals (Angular 17):
 * - `currentUser` is a Signal<User | null> — reactive, no need for BehaviorSubject boilerplate
 * - `isLoggedIn` and `isAdmin` are computed() — auto-update when currentUser changes
 * - Components read signals directly in templates with currentUser()
 *
 * JWT is stored in localStorage so it survives page refresh.
 * On app startup, we call loadCurrentUser() to rehydrate the signal.
 */
@Injectable({ providedIn: 'root' })
export class AccountService {
  private baseUrl = environment.apiUrl + '/account';

  // Signal holding the logged-in user (null = not logged in)
  currentUser = signal<User | null>(null);

  // Computed signals — derived from currentUser, update automatically
  isLoggedIn = computed(() => !!this.currentUser());
  isAdmin = computed(() => {
    const token = this.currentUser()?.token;
    if (!token) return false;
    // Decode JWT payload (base64) to check role claim
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin'
      || payload['role'] === 'Admin';
  });

  constructor(private http: HttpClient, private router: Router) {}

  register(dto: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register`, dto).pipe(
      tap(user => this.setCurrentUser(user))
    );
  }

  login(dto: LoginRequest): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/login`, dto).pipe(
      tap(user => this.setCurrentUser(user))
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`).pipe(
      tap(user => this.setCurrentUser(user))
    );
  }

  updateProfile(dto: UpdateProfileRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/me`, dto);
  }

  uploadPhoto(file: File): Observable<{ photoUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ photoUrl: string }>(`${this.baseUrl}/me/photo`, formData);
  }

  /** Called at app startup to restore session from localStorage */
  loadCurrentUser(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user: User = JSON.parse(userJson);
      // Check token is not expired before restoring
      if (!this.isTokenExpired(user.token)) {
        this.currentUser.set(user);
      } else {
        localStorage.removeItem('user');
      }
    }
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // `exp` is seconds since epoch
      return payload.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  }
}
