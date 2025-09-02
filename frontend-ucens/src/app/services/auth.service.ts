// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // ajuste a URL/porta do seu backend
  private baseUrl = 'http://localhost:5179/api/User';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<string> {
    // envia os campos que o backend espera (Email e Password)
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { Email: email, Password: password })
      .pipe(map(res => res.token));
  }

  setToken(token: string) {
    localStorage.setItem('ucens_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('ucens_token');
  }

  logout() {
    localStorage.removeItem('ucens_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
