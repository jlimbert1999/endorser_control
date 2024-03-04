import { applicantReponse } from '../../infrastructure/interfaces';

interface aplicantProps {
  _id: string;
  firstname: string;
  middlename: string;
  lastname: string;
  dni: string;
  candidate_for: string;
  professional_profile: string;
  endorsers: endorser[];
}
interface endorser {
  name: string;
  organization: string;
}
export class Applicant {
  _id: string;
  firstname: string;
  middlename: string;
  lastname: string;
  dni: string;
  candidate_for: string;
  professional_profile: string;
  endorsers: endorser[];

  static fromResponse(response: applicantReponse) {
    return new Applicant({
      _id: response._id,
      firstname: response.firstname,
      middlename: response.middlename,
      lastname: response.lastname,
      dni: response.dni,
      candidate_for: response.candidate_for,
      professional_profile: response.professional_profile,
      endorsers: response.endorsers,
    });
  }

  constructor({
    _id,
    firstname,
    middlename,
    lastname,
    candidate_for,
    professional_profile,
    endorsers,
    dni,
  }: aplicantProps) {
    this._id = _id;
    this.firstname = firstname;
    this.middlename = middlename;
    this.lastname = lastname;
    this.dni = dni;
    this.candidate_for = candidate_for;
    this.professional_profile = professional_profile;
    this.endorsers = endorsers;
  }

  get fullname() {
    return `${this.firstname} ${this.middlename} ${this.lastname}`;
  }
}
