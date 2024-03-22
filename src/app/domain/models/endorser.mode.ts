import { endorserResponse } from '../../infrastructure/interfaces';

interface endorserProps {
  id: string;
  name: string;
  organization: string;
  total_officers: number;
  total_applicants: number;
}
export class Endorser {
  id: string;
  name: string;
  organization: string;
  total_officers: number;
  total_applicants: number;

  static fromResponse(endorser: endorserResponse) {
    return new Endorser({
      id: endorser._id,
      name: endorser.name,
      organization: endorser.organization?.name ?? 'SIN ORGANIZACION',
      total_applicants: endorser.applicants ?? 0,
      total_officers: endorser.officers ?? 0,
    });
  }
  constructor({
    id,
    name,
    organization,
    total_officers,
    total_applicants,
  }: endorserProps) {
    this.id = id;
    this.name = name;
    this.organization = organization;
    this.total_officers = total_officers;
    this.total_applicants = total_applicants;
  }
}
