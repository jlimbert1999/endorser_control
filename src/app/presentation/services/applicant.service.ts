import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { applicantReponse } from '../../infrastructure/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ApplicantService {
  private readonly url = `${environment.url}/api`;
  constructor(private http: HttpClient) {}

  getApplicants() {
    return this.http.get<{ officers: applicantReponse[] }>(
      `${this.url}/officers`
    );
  }
}
