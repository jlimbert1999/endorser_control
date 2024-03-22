import { Pipe, type PipeTransform } from '@angular/core';
import { officerResponse } from '../../infrastructure/interfaces';

@Pipe({
  name: 'filterOfficer',
  standalone: true,
})
export class FilterOfficerPipe implements PipeTransform {
  transform(officers: officerResponse[], term: string): officerResponse[] {
    if (term === '') return officers;
    return officers.filter(({ nombre, paterno, materno, dni }) => {
      const fullname = `${nombre} ${paterno ?? ''} ${materno ?? ''}`;
      return (
        fullname.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
        (dni ?? '').indexOf(term) > -1
      );
    });
  }
}
