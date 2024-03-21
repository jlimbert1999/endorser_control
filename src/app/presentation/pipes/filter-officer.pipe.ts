import { Pipe, type PipeTransform } from '@angular/core';
import { officerResponse } from '../../infrastructure/interfaces';

@Pipe({
  name: 'appFilterOfficer',
  standalone: true,
})
export class FilterOfficerPipe implements PipeTransform {
  transform(officers: officerResponse[], term: string): officerResponse[] {
    if (term === '') return officers;
    return officers.filter(
      ({ nombre, paterno, materno, dni }) =>
        nombre.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
        paterno.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
        materno.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
        dni.toLowerCase().indexOf(term.toLowerCase()) > -1
    );
  }
}
