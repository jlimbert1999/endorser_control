import { endorser } from '../../domain/models';
import { endorserResponse } from '../interfaces';

export class CreateApplicantDto {
  static fromForm(selected: endorser[], form: any) {
    const endorsers = selected.map((el) => el._id);
    return new CreateApplicantDto(
      form['firstname'],
      form['middlename'],
      form['lastname'],
      form['dni'],
      form['phone'],
      form['professional_profile'],
      form['candidate_for'],
      endorsers
    );
  }
  constructor(
    public firstname: string,
    public middlename: string,
    public lastname: string,
    public dni: string,
    public phone: string,
    public professional_profile: string,
    public candidate_for: string,
    public endorsers: string[]
  ) {}
}
