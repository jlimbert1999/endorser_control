import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { endorserResponse } from '../../infrastructure/interfaces';

@Injectable({
  providedIn: 'root',
})
export class EndorserService {
  private readonly url = `${environment.url}/endorsers`;
  constructor(private http: HttpClient) {}

  create(name: string, organization: string) {
    return this.http.post<endorserResponse>(`${this.url}`, {
      name,
      organization,
    });
  }

  findAll() {
    return this.http.get<{ endorsers: endorserResponse[] }>(`${this.url}`);
  }

  searchAvailables(term: string) {
    return this.http.get<endorserResponse[]>(`${this.url}/available/${term}`);
  }
}
