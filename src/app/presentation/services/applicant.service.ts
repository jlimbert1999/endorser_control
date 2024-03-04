import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  applicantReponse,
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

  upload(data: any[]) {
    return this.http.post<applicantReponse>(`${this.url}/upload`, data);
  }

  getApplicants() {
    return this.http
      .get<{ applicants: applicantReponse[] }>(`${this.url}`)
      .pipe(
        map((resp) => {
          return {
            applicants: resp.applicants.map((el) => Applicant.fromResponse(el)),
          };
        })
      );
  }

  searchjobs(term: string) {
    return this.http.get<any[]>(`${this.url}/jobs/${term}`);
  }

  accept(data: Applicant, id_job: string) {
    const officer = AcceptApplicantDto.fromForm(data, id_job);
    return this.http.post<any>(`${this.url}/accept/${data._id}`, officer);
  }

  getApplicantByEndorser(id_endorser: string) {
    return this.http.get<applicantReponse[]>(
      `${this.url}/endorser/${id_endorser}`
    );
  }
}
