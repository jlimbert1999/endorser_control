import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly url = `${environment.url}/auth`;
  constructor(private http: HttpClient) {}

  login(form: { login: string; password: string }) {
    return this.http
      .post<{ token: string }>(`${this.url}`, form)
      .pipe(map(({ token }) => this.setAuthentication(token)));
  }

  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }
    return this.http
      .get<{
        token: string;
      }>(`${this.url}`)
      .pipe(
        map(({ token }) => {
          return this.setAuthentication(token);
        }),
        catchError(() => {
          return of(false);
        })
      );
  }

  private setAuthentication(token: string): boolean {
    localStorage.setItem('token', token);
    return true;
  }

  logout() {
    localStorage.removeItem('token');
  }
}
