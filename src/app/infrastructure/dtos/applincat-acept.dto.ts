import { Applicant } from '../../domain/models/applicant.model';

export class AcceptApplicantDto {
  static fromForm(form: Applicant, id_job: string) {
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
