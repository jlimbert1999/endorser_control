import { applicantReponse } from '../../infrastructure/interfaces';
import { ApplicantDocument } from '../interfaces/applicant-document.enum';

interface aplicantProps {
  _id: string;
  firstname: string;
  middlename: string;
  lastname: string;
  dni: string;
  candidate_for: string;
  professional_profile: string;
  endorsers: endorser[];
  documents: ApplicantDocument[];
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
  documents: ApplicantDocument[];

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
      documents: response.documents,
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
    documents,
  }: aplicantProps) {
    this._id = _id;
    this.firstname = firstname;
    this.middlename = middlename;
    this.lastname = lastname;
    this.dni = dni;
    this.candidate_for = candidate_for;
    this.professional_profile = professional_profile;
    this.endorsers = endorsers;
    this.documents = documents;
  }

  get fullname() {
    return `${this.firstname} ${this.middlename} ${this.lastname}`;
  }

  haveFile(document: ApplicantDocument) {
    return this.documents.includes(document);
  }

  isEnabled() {
    const validDocuments = Object.values(ApplicantDocument);
    return validDocuments.every((el) => this.documents.includes(el));
  }
}
