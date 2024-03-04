import { applicantReponse, endorserResponse } from '../interfaces';

export class AcceptApplicantDto {
  static fromForm(form: applicantReponse, id_job: string) {
    return new AcceptApplicantDto(
      form['firstname'],
      form['middlename'],
      form['lastname'],
      form['dni'],
      id_job
    );
  }
  constructor(
    public nombre: string,
    public paterno: string,
    public materno: string,
    public dni: string,
    public cargo: string
  ) {}
}
