import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ApplicantService, PdfService } from '../../../services';
import { MaterialModule } from '../../../../material.module';
import { applicantReponse } from '../../../../infrastructure/interfaces';
import { Endorser } from '../../../../domain/models';
import { FilterApplicantPipe } from '../../../pipes/filter-applicant.pipe';

@Component({
  selector: 'app-detail-applicants',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, FilterApplicantPipe],
  templateUrl: './detail-applicants.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `mat-list {
    max-height: 400px;
    overflow: auto;
  }`,
})
export class DetailApplicantsComponent implements OnInit {
  private applicantService = inject(ApplicantService);
  private pdfService = inject(PdfService);
  public endorser: Endorser = inject(MAT_DIALOG_DATA);
  applicants = signal<applicantReponse[]>([]);
  term: string = '';

  ngOnInit(): void {
    this.applicantService
      .getApplicantByEndorser(this.endorser.id)
      .subscribe((data) => {
        this.applicants.set(data);
      });
  }
  print() {
    this.pdfService.generateApplicants(
      'Listado de aplicantes avalados',
      this.applicants(),
      this.endorser
    );
  }
}
