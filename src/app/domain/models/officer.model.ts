import {
  endorserResponse,
  officerResponse,
} from '../../infrastructure/interfaces';

interface officerProps {
  _id: string;
  firstname: string;
  middlename: string;
  lastname: string;
  dni: string;
  job?: job;
  endorsers: endorserResponse[];
}
interface job {
  name: string;
  level: number;
  group: string;
  code: string;
}
export class Officer {
  _id: string;
  firstname: string;
  middlename: string;
  lastname: string;
  dni: string;
  job?: job;
  endorsers: endorserResponse[];

  static reponseToModel(response: officerResponse) {
    return new Officer({
      _id: response._id,
      firstname: response.nombre,
      middlename: response.paterno,
      lastname: response.materno,
      dni: response.dni,
      job: response.cargo
        ? {
            name: response.cargo.nombre,
            level: response.cargo.nivel_id.nivel,
            group: response.cargo.tipoContrato,
            code: response.cargo.codigo,
          }
        : undefined,
      endorsers: response.id_representantive,
    });
  }
  constructor({
    _id,
    firstname,
    middlename,
    lastname,
    dni,
    job,
    endorsers,
  }: officerProps) {
    this._id = _id;
    this.firstname = firstname;
    this.middlename = middlename;
    this.lastname = lastname;
    this.dni = dni;
    this.job = job;
    this.endorsers = endorsers;
  }

  get fullname() {
    return `${this.firstname} ${this.middlename} ${this.lastname ?? ''}`;
  }
}
