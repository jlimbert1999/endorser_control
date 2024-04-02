import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  update(id: string, form: { name?: string }) {
    return this.http.put<organizationResponse>(`${this.url}/${id}`, form);
  }

  findAll(limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<{
      organizations: organizationResponse[];
      length: number;
    }>(`${this.url}`, { params });
  }

  search(term: string, limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<{
      organizations: organizationResponse[];
      length: number;
    }>(`${this.url}/search/${term}`, { params });
  }

  searchAvailable(term: string) {
    return this.http
      .get<organizationResponse[]>(`${this.url}/available/${term}`)
      .pipe(debounceTime(2000));
  }
}
