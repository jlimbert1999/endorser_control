import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { organizationResponse } from '../../infrastructure/interfaces';
import { debounceTime } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private readonly url = `${environment.url}/organizations`;
  constructor(private http: HttpClient) {}

  create(form: { name: string }) {
    return this.http.post<organizationResponse>(`${this.url}`, form);
  }

  findAll() {
    return this.http.get<{ organizations: organizationResponse[] }>(
      `${this.url}`
    );
  }

  searchAvailable(term: string) {
    return this.http
      .get<organizationResponse[]>(`${this.url}/available/${term}`)
      .pipe(debounceTime(2000));
  }
}
