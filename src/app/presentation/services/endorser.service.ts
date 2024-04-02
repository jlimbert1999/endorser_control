import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { endorserResponse } from '../../infrastructure/interfaces';
import { map } from 'rxjs';
import { Endorser } from '../../domain/models';

@Injectable({
  providedIn: 'root',
})
export class EndorserService {
  private readonly url = `${environment.url}/endorsers`;
  constructor(private http: HttpClient) {}

  create(name: string, organization: string) {
    return this.http
      .post<endorserResponse>(`${this.url}`, {
        name,
        organization,
      })
      .pipe(map((el) => Endorser.fromResponse(el)));
  }

  update(endorser: Endorser, data: { name: string; organization: string }) {
    return this.http
      .put<endorserResponse>(`${this.url}/${endorser.id}`, data)
      .pipe(
        map((el) =>
          Endorser.fromResponse({
            ...el,
            officers: endorser.total_officers,
            applicants: endorser.total_applicants,
          })
        )
      );
  }

  findAll(limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http
      .get<{ endorsers: endorserResponse[]; length: number }>(`${this.url}`, {
        params,
      })
      .pipe(
        map((resp) => {
          const endorsers = resp.endorsers.map((el) =>
            Endorser.fromResponse(el)
          );
          return { endorsers, length: resp.length };
        })
      );
  }
  search(term: string, limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http
      .get<{ endorsers: endorserResponse[]; length: number }>(
        `${this.url}/search/${term}`,
        { params }
      )
      .pipe(
        map((resp) => {
          const endorsers = resp.endorsers.map((el) =>
            Endorser.fromResponse(el)
          );
          return { endorsers, length: resp.length };
        })
      );
  }

  searchAvailables(term: string) {
    return this.http.get<endorserResponse[]>(`${this.url}/available/${term}`);
  }
}
