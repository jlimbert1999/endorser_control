import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs';
import { Officer } from '../../domain/models/officer.model';
import { officerResponse } from '../../infrastructure/interfaces';

@Injectable({
  providedIn: 'root',
})
export class OfficerService {
  private readonly url = `${environment.url}/officers`;
  constructor(private http: HttpClient) {}

  findAll(limit: number, offset: number) {
    const params = new HttpParams({
      fromObject: {
        limit,
        offset,
      },
    });
    return this.http
      .get<{ officers: officerResponse[]; length: number }>(`${this.url}`, {
        params,
      })
      .pipe(
        map((resp) => ({
          officers: resp.officers.map((el) => Officer.reponseToModel(el)),
          length: resp.length,
        }))
      );
  }

  update(id: string, endorsers: string[]) {
    return this.http
      .put<officerResponse>(`${this.url}/${id}`, { endorsers: endorsers })
      .pipe(map((resp) => Officer.reponseToModel(resp)));
  }

  search(term: string, limit: number, offset: number) {
    const params = new HttpParams({
      fromObject: {
        limit,
        offset,
      },
    });
    return this.http
      .get<{ officers: officerResponse[]; length: number }>(
        `${this.url}/search/${term}`,
        {
          params,
        }
      )
      .pipe(
        map((resp) => ({
          officers: resp.officers.map((el) => Officer.reponseToModel(el)),
          length: resp.length,
        }))
      );
  }

  getByEndorser(id_endorser: string) {
    return this.http.get<officerResponse[]>(
      `${this.url}/endorsers/${id_endorser}`
    );
  }

  upload(data: any[]) {
    return this.http.post<{ ok: boolean }>(`${this.url}/upload`, data);
  }
}
