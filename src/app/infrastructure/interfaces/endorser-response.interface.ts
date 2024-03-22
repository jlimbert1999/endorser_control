import { organizationResponse } from './organization-reponse.interface';

export interface endorserResponse {
  _id: string;
  name: string;
  officers: number;
  applicants: number;
  organization?: organizationResponse;
}
