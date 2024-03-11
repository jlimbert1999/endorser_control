import { ApplicantDocument } from '../../domain/interfaces/applicant-document.enum';
import { endorserResponse } from './endorser-response.interface';

export interface applicantReponse {
  _id: string;
  firstname: string;
  middlename: string;
  lastname: string;
  dni: string;
  professional_profile: string;
  candidate_for: string;
  phone: string;
  endorsers: endorserResponse[];
  documents: ApplicantDocument[];
  date?: string;
}
