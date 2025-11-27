import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse, DecodedToken } from './auth.interface'; 
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/User`;

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this.storeUserData(response.token);
        }
      })
    );
  }

  private storeUserData(token: string) {
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    const userData = {
      id: decodedToken.id,
      name: decodedToken.username 
    };

    localStorage.setItem('currentUser', JSON.stringify(userData));
  } catch (error) {
    console.error('Falha ao decodificar o token JWT', error);
    this.clearUserData();
  }
}

  private clearUserData() {
    localStorage.removeItem('currentUser');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    this.clearUserData(); 
    this.router.navigate(['/login']);
  }

  getCurrentUser(): { id: string, name: string } | null {
    const user = localStorage.getItem('currentUser');
    if (user) {
      return JSON.parse(user);
    }
    
    const token = this.getToken();
    if (token) {
      try {
        this.storeUserData(token); 
        const reloadedUser = localStorage.getItem('currentUser');
        return reloadedUser ? JSON.parse(reloadedUser) : null;
      } catch (e) {
        this.logout();
        return null;
      }
    }
    return null;
  }

  getUserName(): string | null {
    const user = this.getCurrentUser();
    return user ? user.name : null;
  }

  getUserId(): string | null {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }

  isAdmin(): boolean {
    const userName = this.getUserName();

    return userName ? userName.toLowerCase() === 'admin' : false;
  }
}