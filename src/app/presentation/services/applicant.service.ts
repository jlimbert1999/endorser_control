import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  applicantReponse,
  chargeResponse,
  endorserResponse,
} from '../../infrastructure/interfaces';
import { CreateApplicantDto } from '../../infrastructure/dtos/applicant-create.dto';
import { AcceptApplicantDto } from '../../infrastructure/dtos/applincat-acept.dto';
import { map } from 'rxjs';
import { Applicant } from '../../domain/models/applicant.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicantService {
  private readonly url = `${environment.url}/applicants`;
  constructor(private http: HttpClient) {}

  create(selectedEndorsers: endorserResponse[], form: Object) {
    const applicant = CreateApplicantDto.fromForm(selectedEndorsers, form);
    return this.http.post<applicantReponse>(`${this.url}`, applicant);
  }

  update(id: string, selectedEndorsers: endorserResponse[], form: Object) {
    const applicant = CreateApplicantDto.fromForm(selectedEndorsers, form);
    return this.http.put<applicantReponse>(`${this.url}/${id}`, applicant);
  }

  updateDocuments(id: string, documents: string[]) {
    return this.http
      .put<applicantReponse>(`${this.url}/officer/${id}`, { documents })
      .pipe(map((resp) => Applicant.fromResponse(resp)));
  }

  upload(data: any[]) {
    return this.http.post<applicantReponse>(`${this.url}/upload`, data);
  }

  findAll(limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http
      .get<{ applicants: applicantReponse[]; length: number }>(`${this.url}`, {
        params,
      })
      .pipe(map((resp) => this.responseToModels(resp)));
  }

  getApproved(limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http
      .get<{ applicants: applicantReponse[]; length: number }>(
        `${this.url}/approved`,
        {
          params,
        }
      )
      .pipe(map((resp) => this.responseToModels(resp)));
  }
  search(limit: number, offset: number, term: string) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http
      .get<{ applicants: applicantReponse[]; length: number }>(
        `${this.url}/search/${term}`,
        { params }
      )
      .pipe(map((resp) => this.responseToModels(resp)));
  }

  searchjobs(term: string) {
    return this.http.get<chargeResponse[]>(`${this.url}/jobs/${term}`);
  }

  accept(data: Applicant, id_job: string) {
    return this.http.post<any>(`${this.url}/accept/${data._id}`, { id_job });
  }

  approve(id_applicant: string) {
    return this.http.put<{ message: string }>(
      `${this.url}/approve/${id_applicant}`,
      undefined
    );
  }

  getApplicantByEndorser(id_endorser: string) {
    return this.http.get<applicantReponse[]>(
      `${this.url}/endorser/${id_endorser}`
    );
  }

  private responseToModels(response: {
    applicants: applicantReponse[];
    length: number;
  }): { applicants: Applicant[]; length: number } {
    const models = response.applicants.map((el) => Applicant.fromResponse(el));
    return { applicants: models, length: response.length };
  }
}
