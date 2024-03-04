import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { applicantReponse } from '../../../../infrastructure/interfaces';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApplicantService } from '../../../services';
import { ServerSelectSearchComponent } from '../../../components/server-select-search/server-select-search.component';

interface SelectOption {
  value: string;
  text: string;
}
@Component({
  selector: 'app-accept',
  standalone: true,
  imports: [CommonModule, MaterialModule, ServerSelectSearchComponent],
  templateUrl: './accept.component.html',
  styleUrl: './accept.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcceptComponent {
  public applicant: applicantReponse = inject(MAT_DIALOG_DATA);
  public applicantService = inject(ApplicantService);
  jobs = signal<SelectOption[]>([]);
  id_job: string | undefined = undefined;
  private dialogRef = inject(MatDialogRef<AcceptComponent>);

  seaarchJobs(term: string) {
    this.applicantService.searchjobs(term).subscribe((data) => {
      this.jobs.set(data.map((el) => ({ value: el._id, text: el.nombre })));
    });
  }

  setJob(value: string) {
    this.id_job = value;
  }

  acept() {
    if (!this.id_job) return;
    this.applicantService
      .accept(this.applicant, this.id_job)
      .subscribe((data) => {
        this.dialogRef.close(data);
      });
  }
}
