import { endorserResponse } from './endorser-response.interface';

export interface applicantReponse {
  _id: string;
  firstname: string;
  middlename: string;
  lastname: string;
  dni: string;
  professional_profile: string;
  candidate_for: string;
  endorsers: endorserResponse[];
}
