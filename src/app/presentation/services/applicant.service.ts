import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  applicantReponse,
  endorserResponse,
} from '../../infrastructure/interfaces';
import { CreateApplicantDto } from '../../infrastructure/dtos/applicant-create.dto';

@Injectable({
  providedIn: 'root',
})
export class ApplicantService {
  private readonly url = `${environment.url}/applicants`;
  constructor(private http: HttpClient) {}

  create(selectedEndorsers: endorserResponse[], form: Object) {
    const applicant = CreateApplicantDto.fromForm(selectedEndorsers, form);
    console.log(applicant);
    return this.http.post<applicantReponse>(`${this.url}`, applicant);
  }

  getApplicants() {
    return this.http.get<{ applicants: applicantReponse[] }>(`${this.url}`);
  }
}
