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

  create(name: string, people: number) {
    return this.http.post<endorserResponse>(`${this.url}`, { name, people });
  }

  findAll() {
    return this.http.get<{ endorsers: endorserResponse[] }>(`${this.url}`);
  }
}
