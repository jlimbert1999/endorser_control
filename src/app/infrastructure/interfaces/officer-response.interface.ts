import { endorserResponse } from './endorser-response.interface';

export interface officerResponse {
  _id: string;
  nombre: string;
  paterno: string;
  materno: string;
  dni: string;
  cargo?: jobResponse;
  activo: boolean;
  id_representantive: endorserResponse[];
}

interface jobResponse {
  _id: string;
  nombre: string;
  codigo: string;
  tipoContrato: string;
  nivel_id: {
    nivel: number;
  };
}
