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
  phone: string;
  endorsers: endorser[];
  documents: ApplicantDocument[];
  date?: Date;
}

interface endorser {
  name: string;
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
  phone: string;
  date?: Date;

  static fromResponse(response: applicantReponse) {
    return new Applicant({
      _id: response._id,
      firstname: response.firstname,
      middlename: response.middlename,
      lastname: response.lastname,
      dni: response.dni,
      candidate_for: response.candidate_for,
      professional_profile: response.professional_profile,
      endorsers: response.endorsers.map((el) => ({
        name: el.name,
      })),
      documents: response.documents,
      phone: response.phone,
      date: response.date ? new Date(response.date) : undefined,
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
    phone,
    date,
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
    this.phone = phone;
    this.date = date;
  }

  get fullname() {
    return `${this.firstname} ${this.middlename} ${this.lastname ?? ''}`;
  }

  haveFile(document: ApplicantDocument) {
    return this.documents.includes(document);
  }

  isEnabled() {
    const validDocuments = Object.values(ApplicantDocument);
    return validDocuments.every((el) => this.documents.includes(el));
  }
}
