import { Pipe, type PipeTransform } from '@angular/core';
import { applicantReponse } from '../../infrastructure/interfaces';

@Pipe({
  name: 'filterApplicant',
  standalone: true,
})
export class FilterApplicantPipe implements PipeTransform {
  transform(officers: applicantReponse[], term: string): applicantReponse[] {
    if (term === '') return officers;
    return officers.filter(({ firstname, middlename, lastname, dni }) => {
      const fullname = `${firstname} ${middlename ?? ''} ${lastname ?? ''}`;
      return (
        fullname.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
        (dni ?? '').indexOf(term) > -1
      );
    });
  }
}
