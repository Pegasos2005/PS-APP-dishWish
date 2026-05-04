// src/app/core/services/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl + 'auth/login';

  // Signals para saber quién está logueado
  currentUserRole = signal<string | null>(sessionStorage.getItem('userRole'));
  currentUserName = signal<string | null>(sessionStorage.getItem('userName'));

  constructor(private http: HttpClient) {}

  // Intenta hacer login. Si tiene éxito, guarda el rol en memoria.
  login(username: string | null, pin: string): Observable<any> {
    const body = username ? { username, pin } : { pin };

    return this.http.post<any>(this.apiUrl, body).pipe(
      tap(response => {
        // Guardamos los datos de sesión[cite: 26]
        sessionStorage.setItem('userRole', response.role);
        sessionStorage.setItem('userName', response.name);
        this.currentUserRole.set(response.role);
        this.currentUserName.set(response.name);
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userName');
    this.currentUserRole.set(null);
    this.currentUserName.set(null);
  }
}
