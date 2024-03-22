import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { OfficerService, PdfService } from '../../../services';
import { officerResponse } from '../../../../infrastructure/interfaces';
import { FilterOfficerPipe } from '../../../pipes/filter-officer.pipe';
import { Endorser } from '../../../../domain/models';
import { MaterialModule } from '../../../../material.module';

@Component({
  selector: 'app-detail-officers',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    FilterOfficerPipe,
    FormsModule,
    MatInputModule,
    MaterialModule,
  ],
  templateUrl: './detail-officers.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `mat-list {
    max-height: 400px;
    overflow: auto;
  }`,
})
export class DetailOfficersComponent {
  private officerService = inject(OfficerService);
  private pdfService = inject(PdfService);

  public endorser: Endorser = inject(MAT_DIALOG_DATA);
  officers = signal<officerResponse[]>([]);
  term = '';

  ngOnInit(): void {
    this.officerService.getByEndorser(this.endorser.id).subscribe((data) => {
      this.officers.set(data);
    });
  }

  print() {
    this.pdfService.generateOfficers(
      'Listado de funcionarios avalados',
      this.officers(),
      this.endorser
    );
  }
}
