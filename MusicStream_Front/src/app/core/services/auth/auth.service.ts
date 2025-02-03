import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/auth';

  constructor(private readonly http: HttpClient) {}

  private getHeaders(includeAuth: boolean = false): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers = headers.append('Authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/login`,
      { username, password },
      { headers: this.getHeaders() }
    );
  }

  register(username: string, password: string, roles: string[]): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/register`,
      { username, password, roles },
      { headers: this.getHeaders() }
    );
  }

  logout(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/logout`,
      {},
      { headers: this.getHeaders(true) }
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isTokenExpired(token: string): boolean {
    const decoded: any = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp && decoded.exp < now;
  }
}
