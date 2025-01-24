import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/auth';

  constructor(private readonly http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`,
      { username, password },
      { headers: this.getHeaders() }
    );
  }

  register(username: string, password: string, roles: string []): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`,
      { username, password, roles },
      { headers: this.getHeaders() }
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {},
      { headers: this.getHeaders() }
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
