import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import {
  applicantReponse,
  chargeResponse,
  endorserResponse,
} from '../../infrastructure/interfaces';
import { CreateApplicantDto } from '../../infrastructure/dtos/applicant-create.dto';
import { Applicant } from '../../domain/models/applicant.model';

type status = 'accepted' | 'pending';

interface getApplicantParams {
  limit: number;
  offset: number;
  status: status;
  date?: Date;
}
@Injectable({
  providedIn: 'root',
})
export class ApplicantService {
  private readonly url = `${environment.url}/applicants`;
  constructor(private http: HttpClient) {}

  getCompleted(date: Date, limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http
      .get<{ applicants: applicantReponse[]; length: number }>(
        `${this.url}/completed/${date.getTime()}`,
        { params }
      )
      .pipe(map((resp) => this.responseToModels(resp)));
  }

  findAll({ limit, offset, status, date }: getApplicantParams) {
    const params = new HttpParams({
      fromObject: {
        limit,
        offset,
        status,
        ...(date && { date: date.getTime() }),
      },
    });
    return this.http
      .get<{ applicants: applicantReponse[]; length: number }>(`${this.url}`, {
        params,
      })
      .pipe(map((resp) => this.responseToModels(resp)));
  }

  search(term: string, { limit, offset, status, date }: getApplicantParams) {
    const params = new HttpParams({
      fromObject: {
        limit,
        offset,
        status,
        ...(date && { date: date.getTime() }),
      },
    });
    return this.http
      .get<{ applicants: applicantReponse[]; length: number }>(
        `${this.url}/search/${term}`,
        { params }
      )
      .pipe(map((resp) => this.responseToModels(resp)));
  }

  create(selectedEndorsers: endorserResponse[], form: Object) {
    const applicant = CreateApplicantDto.fromForm(selectedEndorsers, form);
    return this.http.post<applicantReponse>(`${this.url}`, applicant);
  }

  update(id: string, selectedEndorsers: endorserResponse[], form: Object) {
    const applicant = CreateApplicantDto.fromForm(selectedEndorsers, form);
    return this.http
      .put<applicantReponse>(`${this.url}/${id}`, applicant)
      .pipe(map((resp) => Applicant.fromResponse(resp)));
  }

  updateDocuments(id: string, documents: string[]) {
    return this.http
      .put<applicantReponse>(`${this.url}/officer/${id}`, { documents })
      .pipe(map((resp) => Applicant.fromResponse(resp)));
  }

  upload(data: any[]) {
    return this.http.post<applicantReponse>(`${this.url}/upload`, data);
  }

  searchjobs(term: string) {
    return this.http.get<chargeResponse[]>(`${this.url}/jobs/${term}`);
  }

  accept(data: Applicant, id_job: string, name: string) {
    return this.http.post<boolean>(`${this.url}/accept/${data._id}`, {
      id_job,
      name,
    });
  }

  getApplicantByEndorser(id_endorser: string) {
    return this.http.get<applicantReponse[]>(
      `${this.url}/endorser/${id_endorser}`
    );
  }

  toggleAproved(id_applicant: string) {
    return this.http.put<void>(
      `${this.url}/approve/${id_applicant}`,
      undefined
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
