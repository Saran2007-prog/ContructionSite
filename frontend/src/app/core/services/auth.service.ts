import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface User {
  _id: string;
  email: string;
  role: string;
  profile: UserProfile;
}

export interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Change this to your hosted backend URL in production (e.g. 'https://contruction-site-backend.onrender.com/api')
  private apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : 'https://contruction-site-backend.onrender.com/api';

  public getApiUrl(): string {
    return this.apiUrl;
  }

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCurrentUser();
  }

  private loadCurrentUser() {
    const token = this.getToken();
    if (token) {
      try {
        const decoded = this.decodeToken(token);
        // Expiry check
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          this.logout();
          return;
        }
        
        // Retrieve profile cache or initialize
        const cachedUser = localStorage.getItem('bt_user');
        if (cachedUser) {
          this.currentUserSubject.next(JSON.parse(cachedUser));
        } else {
          // If no full cache, populate basic from token
          const user: User = {
            _id: decoded._id,
            email: decoded.email,
            role: decoded.role,
            profile: { firstName: 'User', lastName: decoded.role }
          };
          this.currentUserSubject.next(user);
        }
      } catch (e) {
        this.logout();
      }
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      map(response => {
        if (response && response.token) {
          localStorage.setItem('bt_token', response.token);
          localStorage.setItem('bt_user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
        return response;
      })
    );
  }

  inviteUser(userData: { email: string; password: string; role: string; profile: UserProfile }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/invite`, userData);
  }

  register(userData: { email: string; password: string; role: string; profile: UserProfile }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, userData);
  }

  logout() {
    localStorage.removeItem('bt_token');
    localStorage.removeItem('bt_user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('bt_token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded = this.decodeToken(token);
      return decoded.exp ? decoded.exp * 1000 > Date.now() : true;
    } catch {
      return false;
    }
  }

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded = this.decodeToken(token);
      return decoded.role || null;
    } catch {
      return null;
    }
  }

  // Pure JS Base64 JWT decoding helper to avoid dependency issues on startup
  private decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('JWT must have 3 parts');
      }
      const payload = parts[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      throw new Error('Error decoding JWT token');
    }
  }
}
